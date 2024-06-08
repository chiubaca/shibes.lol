import { Image } from "@unpic/react";
import { makeImageUrl } from "../lib/bucket-access";

type PictureGalleryProps = {
  submissions: {
    id: number;
    imageRef: string;
    userName: string;
    date: string;
  }[];
};

export const PictureGallery: React.FC<PictureGalleryProps> = ({
  submissions,
}) => {
  return (
    <div className="grid grid-cols-1 mx-auto max-w-sm pb-32 gap-5 md:max-w-2xl md:grid-cols-2 lg:max-w-7xl lg:grid-cols-4">
      {submissions.map((submission) => {
        return (
          <div
            key={submission.id}
            className="rounded-lg shadow-lg gap-5 pl-5 pr-5 pt-5 pb-2 flex justify-around flex-col"
          >
            <Image
              src={makeImageUrl(submission.imageRef)}
              width={400}
              aspectRatio={1}
              background="auto"
            />
            <span>
              <p className="text-sm text-gray-800">
                posted by {submission.userName}
              </p>
              <p className="text-xs text-gray-500">{submission.date}</p>
            </span>
          </div>
        );
      })}
    </div>
  );
};
