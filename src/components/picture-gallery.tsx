import { Image } from "@unpic/react";
import { makeImageUrl } from "../lib/bucket-access";

type PictureGalleryProps = {
  imgRefs: string[];
};

export const PictureGallery: React.FC<PictureGalleryProps> = ({ imgRefs }) => {
  return (
    <div className="flex flex-row flex-wrap justify-evenly">
      {imgRefs.map((imgRef) => {
        return (
          <div key={imgRef}>
            <Image
              src={makeImageUrl(imgRef)}
              width={400}
              aspectRatio={1}
              background="auto"
            />
          </div>
        );
      })}
    </div>
  );
};
