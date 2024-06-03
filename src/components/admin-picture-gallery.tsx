import { Image } from "@unpic/react";
import { makeImageUrl } from "../lib/bucket-access";

import { actions } from "astro:actions";
import { useState } from "react";

type Submission = {
  id: number;
  imageRef: string;
  userId: string;
};

type PictureGalleryProps = {
  submissions: Submission[];
};

export const AdminPictureGallery: React.FC<PictureGalleryProps> = ({
  submissions,
}) => {
  return (
    <div className="flex flex-row flex-wrap justify-evenly">
      {submissions.map((submission) => {
        return <ImageBox key={submission.id} submission={submission} />;
      })}
    </div>
  );
};

const ImageBox: React.FC<{ submission: Submission }> = ({ submission }) => {
  const [removeState, setRemovalState] = useState<
    "image-deleted" | "error" | undefined
  >();

  const handleRemoveShiba = async (args: { id: number; imgRef: string }) => {
    const resp = await actions.removeShiba({
      id: args.id,
      imgRef: args.imgRef,
    });

    if (resp.type === "success") {
      setRemovalState("image-deleted");
      return;
    }
  };

  return (
    <div key={submission.id} className="flex items-center border">
      <div>{removeState}</div>
      <div className="flex flex-col items-center">
        <Image
          src={makeImageUrl(submission.imageRef)}
          width={400}
          aspectRatio={1}
          background="auto"
        />
        <p>Submitted by {submission.userId}</p>
        <button className="btn bg-orange-400">🙅 Ban</button>
      </div>

      <button
        disabled={removeState === "image-deleted"}
        className="btn bg-red-700 text-grey-200"
        onClick={() =>
          handleRemoveShiba({ id: submission.id, imgRef: submission.imageRef })
        }
      >
        🗑️ Remove
      </button>
    </div>
  );
};
