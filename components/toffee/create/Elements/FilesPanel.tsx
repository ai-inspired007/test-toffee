import { KnowledgeFile } from "@prisma/client";
import { FilesPrivate } from "../../icons/Lock";
const Files = ({ files }: { files: Partial<KnowledgeFile>[] }) => {
    return (
        <div className="flex-grow items-center justify-center flex flex-col">
            {files.length > 0 ? (<div>{files.length}</div>) : (
                <div className="flex flex-col gap-2 max-w-72 items-center">
                    <FilesPrivate />
                    <span className="text-base  text-text-sub font-medium text-center mt-2">Files are private</span>
                    <span className="text-sm text-text-tertiary  text-center">The creator of the Knowledge Pack has chosen to keep thecontents private</span>
                </div>
            )}
        </div>
    )
}

export default Files;