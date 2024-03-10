import { useParams, useRouteLoaderData } from "react-router";

import toast from "react-hot-toast";

import { IoCloudDownloadOutline } from "react-icons/io5";

import NoNotesOrAss from "../Components/NoNotesOrAss";

import { DownloadFile } from "../Actions/SupabaseActions";

import {
  FormatTime,
  SortArrayBasedOnCreatedAt,
} from "../Actions/HelperActions";
import Table from "../Components/Table";

function NotesPage() {
  const { notes } = useRouteLoaderData("courseData");

  //removes supabase placeholder file from array
  const allNotes = notes.filter((c) => c.name !== ".emptyFolderPlaceholder");

  const sortedNotes = SortArrayBasedOnCreatedAt(allNotes);

  const { code } = useParams();

  async function handleDownload(filename) {
    try {
      // Fetch the PDF file content
      const pdfBlob = await DownloadFile(`${code}/notes/${filename}`);

      // Create a Blob URL from the Blob
      const pdfUrl = URL.createObjectURL(pdfBlob);

      // Create a temporary anchor element
      const a = document.createElement("a");
      a.href = pdfUrl;
      a.download = filename;

      // trigger a click event on the anchor element
      a.click();

      // Revoke the Blob URL after the tab is closed
      //this prevents the document that was opened from being opened again
      URL.revokeObjectURL(pdfUrl);
    } catch (err) {
      toast.error(err.message);
    }
  }

  return (
    <>
      {allNotes.length ? (
        <Table
          tableLabel={`All Notes (${allNotes.length})`}
          headLabels={["S/N", "Title", "Uploaded"]}
        >
          {sortedNotes.map((note, index) => {
            return (
              <tr
                className={`table-row ${index % 2 ? "bg-tableEven" : "bg-tableOdd"}`}
                onClick={() => handleDownload(note.name)}
                key={index}
              >
                <td className="py-3">{index + 1}</td>

                <td className="hidden py-3 lg:block">
                  {note.name.split(".")[0]} &nbsp;
                  <span className="text-xs">[click to download]</span>
                </td>

                <td className="flex items-center justify-center py-3 lg:hidden">
                  {note.name.split(".")[0]} &nbsp;
                  <span className="text-base">
                    <IoCloudDownloadOutline />
                  </span>
                </td>

                <td className="py-3 text-xs">{FormatTime(note.created_at)}</td>
              </tr>
            );
          })}
        </Table>
      ) : (
        <NoNotesOrAss label={"Notes"} />
      )}
    </>
  );
}

export default NotesPage;
