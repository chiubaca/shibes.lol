import { useState } from "react";

import { actions, getActionProps } from "astro:actions";

export const ShibaUpload: React.FC<{ user: OAuthUser | null }> = ({ user }) => {
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
          required
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

        <button
          disabled={user?.role === "banned"}
          type="submit"
          className="btn btn-info"
        >
          submit
        </button>
        {user?.role === "banned" && (
          <div className="text-red-800">
            you've been banned from posting.
            <a
              href="/terms"
              target="_blank"
              rel="noopener noreferrer"
              className="link hover:link-hover"
            >
              did you break ours terms
            </a>
            ?{" "}
            <a
              href="https://twitter.com/chiubaca"
              target="_blank"
              rel="noopener noreferrer"
              className="link hover:link-hover"
            >
              contact me
            </a>{" "}
            if you think is an error.
          </div>
        )}
      </form>

      {error && <>{error}</>}
    </>
  );
};
