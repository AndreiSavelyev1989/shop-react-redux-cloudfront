import React from "react";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import axios, { AxiosError } from "axios";
import { getAuthorizationHeader, getResultMessage } from "~/utils/utils";

type CSVFileImportProps = {
  url: string;
  title: string;
};

export default function CSVFileImport({ url, title }: CSVFileImportProps) {
  const [file, setFile] = React.useState<File>();

  React.useEffect(() => {
    localStorage.setItem("user_name", "AndreiSavelyev1989");
    localStorage.setItem("password", "TEST_PASSWORD");
  }, []);

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
      return;
    }

    try {
      const response = await axios({
        method: "GET",
        url,
        params: {
          name: encodeURIComponent(file.name),
        },
        headers: {
          ...getAuthorizationHeader(),
        },
      });
      console.log("File to upload: ", file.name);
      console.log("Uploading to: ", response.data);

      const result = await fetch(response.data.url, {
        method: "PUT",
        body: file,
      });

      getResultMessage(
        result.status,
        `${result.statusText}. File uploaded successfully!`
      );
      console.log("Result: ", result);
      setFile(undefined);
    } catch (err) {
      const error = err as AxiosError;
      console.log("Error", error);
      if (error?.response?.status === 403) {
        getResultMessage(error.response.status, error.message);
      }
      if (error?.response?.status === 401) {
        getResultMessage(error.response.status, error.message);
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
