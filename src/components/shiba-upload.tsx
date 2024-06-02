import { useState } from "react";

import { actions, getActionProps } from "astro:actions";

export const ShibaUpload = () => {
  const [error, setError] = useState<string>("");

  return (
    <>
      <form
        className="flex flex-col gap-2"
        method="POST"
        onSubmit={async (e) => {
          e.preventDefault();
          const formData = new FormData(e.target as HTMLFormElement);
          window.location.hash = "";
          try {
            const resp = await actions.submitShiba(formData);

            if (resp.type === "error") {
              setError(resp.message);
              return;
            }

            window.location.hash = "#gallery";
            window.location.reload();
          } catch (error) {
            console.error("💩", error);
            setError("for submission error");
          }
        }}
      >
        <input {...getActionProps(actions.submitShiba)} />

        <input
          id="file-upload"
          name="imageFile"
          accept=".png,.jpg,.jpeg,.webp"
          type="file"
          className="file-input file-input-bordered file-input-primary w-full grow lowercase"
        />

        <label className="input input-bordered flex items-center gap-2 w-full">
          <input
            type="url"
            name="creditsUrl"
            className="grow"
            placeholder="credit original source (url)"
          />
          <span className="badge badge-ghost">optional</span>
        </label>

        <button type="submit" className="btn btn-info">
          submit
        </button>
      </form>

      {error && <>{error}</>}
    </>
  );
};
