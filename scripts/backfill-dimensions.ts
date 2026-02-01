const BUCKET_URL = "https://assets.shibes.lol";
const BATCH_SIZE = 100;

async function getImageDimensions(imageRef: string): Promise<{ width: number; height: number } | null> {
  try {
    const url = `${BUCKET_URL}/${imageRef}`;
    const response = await fetch(url);
    if (!response.ok) {
      console.error(`  Failed to fetch ${imageRef}: ${response.status} ${response.statusText}`);
      return null;
    }
    
    const blob = await response.blob();
    const buffer = await blob.arrayBuffer();
    const bytes = new Uint8Array(buffer);
    
    return getDimensionsFromBuffer(bytes);
  } catch (error) {
    console.error(`  Error fetching ${imageRef}:`, error);
    return null;
  }
}

function getDimensionsFromBuffer(bytes: Uint8Array): { width: number; height: number } | null {
  if (bytes[0] === 0x89 && bytes[1] === 0x50 && bytes[2] === 0x4E && bytes[3] === 0x47) {
    const width = (bytes[16] << 24) | (bytes[17] << 16) | (bytes[18] << 8) | bytes[19];
    const height = (bytes[20] << 24) | (bytes[21] << 16) | (bytes[22] << 8) | bytes[23];
    return { width, height };
  }
  
  if (bytes[0] === 0xFF && bytes[1] === 0xD8 && bytes[2] === 0xFF) {
    let offset = 2;
    while (offset < bytes.length) {
      if (bytes[offset] !== 0xFF) break;
      const marker = bytes[offset + 1];
      
      if (marker === 0xC0 || marker === 0xC2) {
        const height = (bytes[offset + 5] << 8) | bytes[offset + 6];
        const width = (bytes[offset + 7] << 8) | bytes[offset + 8];
        return { width, height };
      }
      
      const length = (bytes[offset + 2] << 8) | bytes[offset + 3];
      offset += 2 + length;
    }
  }
  
  if (bytes[0] === 0x47 && bytes[1] === 0x49 && bytes[2] === 0x46 && bytes[3] === 0x38) {
    const width = bytes[6] | (bytes[7] << 8);
    const height = bytes[8] | (bytes[9] << 8);
    return { width, height };
  }
  
  if (bytes[0] === 0x52 && bytes[1] === 0x49 && bytes[2] === 0x46 && bytes[3] === 0x46) {
    if (bytes[12] === 0x56 && bytes[13] === 0x50 && bytes[14] === 0x38 && bytes[15] === 0x58) {
      const width = (bytes[24] | (bytes[25] << 8) | (bytes[26] << 16)) + 1;
      const height = (bytes[27] | (bytes[28] << 8) | (bytes[29] << 16)) + 1;
      return { width, height };
    }
    if (bytes[12] === 0x56 && bytes[13] === 0x50 && bytes[14] === 0x38 && bytes[15] === 0x20) {
      const width = (bytes[26] | (bytes[27] << 8)) & 0x3FFF;
      const height = (bytes[28] | (bytes[29] << 8)) & 0x3FFF;
      return { width, height };
    }
  }
  
  return null;
}

async function backfill() {
  const accountId = process.env.CLOUDFLARE_ACCOUNT_ID;
  const databaseId = process.env.CLOUDFLARE_DATABASE_ID;
  const token = process.env.CLOUDFLARE_D1_TOKEN;
  
  if (!accountId || !databaseId || !token) {
    throw new Error("Missing D1 credentials");
  }
  
  let totalProcessed = 0;
  let totalFailed = 0;
  let offset = 0;
  let hasMore = true;
  
  console.log("🔍 Starting full database backfill...\n");
  
  while (hasMore) {
    const selectResponse = await fetch(
      `https://api.cloudflare.com/client/v4/accounts/${accountId}/d1/database/${databaseId}/query`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          sql: `SELECT id, image_ref FROM shiba_submission_v2 WHERE image_width IS NULL ORDER BY id ASC LIMIT ${BATCH_SIZE} OFFSET ${offset}`,
        }),
      }
    );
    
    const selectData = (await selectResponse.json()) as {
      success: boolean;
      result?: Array<{ results: Array<{ id: number; image_ref: string }> }>;
    };
    
    const queryResult = selectData.result?.[0];
    const records = queryResult?.results || [];
    
    if (records.length === 0) {
      hasMore = false;
      break;
    }
    
    console.log(`📋 Batch ${Math.floor(offset / BATCH_SIZE) + 1}: Processing ${records.length} records...\n`);
    
    for (const row of records) {
      const id = row.id;
      const imageRef = row.image_ref;
      
      const dims = await getImageDimensions(imageRef);
      
      if (dims) {
        const updateResponse = await fetch(
          `https://api.cloudflare.com/client/v4/accounts/${accountId}/d1/database/${databaseId}/query`,
          {
            method: "POST",
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              sql: `UPDATE shiba_submission_v2 SET image_width = ${dims.width}, image_height = ${dims.height} WHERE id = ${id}`,
            }),
          }
        );
        
        const updateData = (await updateResponse.json()) as { success: boolean };
        
        if (updateData.success) {
          console.log(`  ✅ id=${id}: ${dims.width}x${dims.height}`);
          totalProcessed++;
        } else {
          console.log(`  ❌ id=${id}: Update failed`);
          totalFailed++;
        }
      } else {
        console.log(`  ❌ id=${imageRef}: Failed to get dimensions`);
        totalFailed++;
      }
    }
    
    offset += BATCH_SIZE;
  }
  
  console.log(`\n✅ Backfill complete!`);
  console.log(`   Processed: ${totalProcessed}`);
  console.log(`   Failed: ${totalFailed}`);
}

backfill().catch(console.error);
