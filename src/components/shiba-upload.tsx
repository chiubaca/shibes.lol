import { useState } from "react";

import { actions, getActionProps } from "astro:actions";

export const ShibaUpload = () => {
  const [error, setError] = useState<string>("");

  return (
    <>
      {error && <>{error}</>}

      <form
        method="POST"
        onSubmit={async (e) => {
          e.preventDefault();
          const formData = new FormData(e.target as HTMLFormElement);

          try {
            const resp = await actions.submitShiba(formData);

            if (resp.type === "error") {
              setError(resp.message);
              return;
            }
          } catch (error) {
            console.error("💩", error);
            setError("something went badly wrong");
          }
        }}
      >
        <input {...getActionProps(actions.submitShiba)} />
        <input name="text" type="text" />
        <input
          required
          type="file"
          id="file-upload"
          name="imageFile"
          accept="image/*"
        />
        <button type="submit">submit shiba</button>
      </form>
    </>
  );
};
