import React from "react";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import axios, { AxiosError } from "axios";

type CSVFileImportProps = {
  url: string;
  title: string;
};

export default function CSVFileImport({ url, title }: CSVFileImportProps) {
  const [file, setFile] = React.useState<File>();

  const onFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      const file = files[0];
      setFile(file);
    }
  };

  const removeFile = () => {
    setFile(undefined);
  };

  const uploadFile = async () => {
    if (!file) {
      console.log("file absent", { file });
      return;
    }

    console.log("uploadFile to", url);

    const password = localStorage.getItem("authorization_token") ?? "";

    console.log({ password });

    // Get the presigned URL
    try {
      const response = await axios({
        method: "GET",
        url,
        params: {
          name: encodeURIComponent(file.name),
        },
        headers: {
          "Access-Control-Allow-Origin": "*"
        },
        auth: {
          username: "yours_github_account_login",
          password: password,
        },
      });
      console.log("File to upload: ", file.name);
      console.log("Uploading to: ", response.data);

      // const result = await fetch(response.data.url, {
      //   method: "PUT",
      //   body: file,
      // });

      // console.log("Result: ", result);
      setFile(undefined);
    } catch (err) {
      const error = err as AxiosError;
      console.log("Error", error);
      if (error?.response?.status === 403) {
        alert(
          "403 Forbidden \nLocal Storage has wrong authorization_token (password)"
        );
      }
      if (error?.response?.status === 401) {
        alert(
          "401 Unauthorized \nLocal Storage has not authorization_token (password)"
        );
      }
    }
  };
  return (
    <Box>
      <Typography variant="h6" gutterBottom>
        {title}
      </Typography>
      {!file ? (
        <input type="file" onChange={onFileChange} />
      ) : (
        <div>
          <button onClick={removeFile}>Remove file</button>
          <button onClick={uploadFile}>Upload file</button>
        </div>
      )}
    </Box>
  );
}
