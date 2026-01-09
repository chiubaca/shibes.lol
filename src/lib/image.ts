export const makeImageUrl = (imageRef: string, transformParams?: string) => {
	const { VITE_PUBLIC_TRANSFORM_URL, VITE_PUBLIC_BUCKET_URL } = import.meta.env;

	if (!VITE_PUBLIC_TRANSFORM_URL) {
		throw new Error("You have not configured the image transform url");
	}

	if (!VITE_PUBLIC_BUCKET_URL) {
		throw new Error("You have not configured your public bucket access");
	}

	return `${VITE_PUBLIC_TRANSFORM_URL}/${
		transformParams ? transformParams : "f=auto"
	}/${VITE_PUBLIC_BUCKET_URL}/${imageRef}`;
};
