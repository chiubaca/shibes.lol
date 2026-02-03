async function hmacSha1(key: string, data: string): Promise<string> {
  const keyBuffer = new TextEncoder().encode(key);
  const dataBuffer = new TextEncoder().encode(data);
  const cryptoKey = await crypto.subtle.importKey(
    "raw",
    keyBuffer,
    { name: "HMAC", hash: "SHA-1" },
    false,
    ["sign"]
  );
  const signature = await crypto.subtle.sign("HMAC", cryptoKey, dataBuffer);
  return btoa(String.fromCharCode(...new Uint8Array(signature)));
}

function percentEncode(str: string): string {
  return encodeURIComponent(str)
    .replace(/!/g, "%21")
    .replace(/'/g, "%27")
    .replace(/\(/g, "%28")
    .replace(/\)/g, "%29")
    .replace(/\*/g, "%2A");
}

async function generateOAuthSignature(
  method: string,
  url: string,
  params: Record<string, string>,
  oauthTokenSecret: string
): Promise<string> {
  const sortedParams = Object.keys(params)
    .sort()
    .map((key) => `${percentEncode(key)}=${percentEncode(params[key])}`)
    .join("&");

  const signatureBase = [
    method.toUpperCase(),
    percentEncode(url),
    percentEncode(sortedParams),
  ].join("&");

  const signingKey = `${percentEncode(process.env.TWITTER_API_KEY_SECRET!)}&${percentEncode(oauthTokenSecret)}`;

  return hmacSha1(signingKey, signatureBase);
}

async function uploadMediaToTwitter(imageBlob: Blob): Promise<string> {
  const oauthToken = process.env.TWITTER_ACCESS_TOKEN!;
  const oauthTokenSecret = process.env.TWITTER_ACCESS_TOKEN_SECRET!;
  const url = "https://upload.twitter.com/1.1/media/upload.json";

  const nonce = crypto.randomUUID().replace(/-/g, "");
  const timestamp = Math.floor(Date.now() / 1000).toString();

  const oauthParams: Record<string, string> = {
    oauth_consumer_key: process.env.TWITTER_API_KEY!,
    oauth_token: oauthToken,
    oauth_signature_method: "HMAC-SHA1",
    oauth_timestamp: timestamp,
    oauth_nonce: nonce,
    oauth_version: "1.0",
  };

  const signature = await generateOAuthSignature("POST", url, oauthParams, oauthTokenSecret);
  oauthParams.oauth_signature = signature;

  const authHeader =
    "OAuth " +
    Object.entries(oauthParams)
      .map(([key, value]) => `${percentEncode(key)}="${percentEncode(value)}"`)
      .join(", ");

  const formData = new FormData();
  formData.append("media", imageBlob, "image.jpg");

  const response = await fetch(url, {
    method: "POST",
    headers: { Authorization: authHeader },
    body: formData,
  });

  if (!response.ok) {
    const error = await response.text();
    throw new Error(`Twitter media upload failed: ${error}`);
  }

  const data = await response.json();
  return data.media_id_string;
}

async function createTweetWithMedia(mediaId: string): Promise<unknown> {
  const oauthToken = process.env.TWITTER_ACCESS_TOKEN!;
  const oauthTokenSecret = process.env.TWITTER_ACCESS_TOKEN_SECRET!;
  const url = "https://api.twitter.com/2/tweets";

  const nonce = crypto.randomUUID().replace(/-/g, "");
  const timestamp = Math.floor(Date.now() / 1000).toString();

  const body = JSON.stringify({ media: { media_ids: [mediaId] } });

  const oauthParams: Record<string, string> = {
    oauth_consumer_key: process.env.TWITTER_API_KEY!,
    oauth_token: oauthToken,
    oauth_signature_method: "HMAC-SHA1",
    oauth_timestamp: timestamp,
    oauth_nonce: nonce,
    oauth_version: "1.0",
  };

  const signature = await generateOAuthSignature("POST", url, oauthParams, oauthTokenSecret);
  oauthParams.oauth_signature = signature;

  const authHeader =
    "OAuth " +
    Object.entries(oauthParams)
      .map(([key, value]) => `${percentEncode(key)}="${percentEncode(value)}"`)
      .join(", ");

  const response = await fetch(url, {
    method: "POST",
    headers: {
      Authorization: authHeader,
      "Content-Type": "application/json",
    },
    body,
  });

  if (!response.ok) {
    const error = await response.text();
    throw new Error(`Twitter tweet creation failed: ${error}`);
  }

  return response.json();
}

export const uploadToTwitter = async (imageUrl: string) => {
  try {
    const imageResp = await fetch(imageUrl);
    if (!imageResp.ok) {
      throw new Error(`Failed to fetch image: ${imageResp.status}`);
    }

    const imageBlob = await imageResp.blob();
    const mediaId = await uploadMediaToTwitter(imageBlob);
    const tweet = await createTweetWithMedia(mediaId);

    console.log("✅ Successfully posted to twitter!", tweet);
    return tweet;
  } catch (error) {
    console.error("❌ Problem uploading media to twitter", error);
    throw new Error("Problem uploading media to twitter");
  }
};
