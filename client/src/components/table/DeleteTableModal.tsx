import Modal from '../shared/Modal'
import { useQlMutation } from '../../graphql/globalRequest'
import { deleteTable } from '../../graphql/query/table'
import { useQueryClient } from '@tanstack/react-query'
import { TABLES } from '../../tanstackKeys'
import { enqueueSnackbar } from 'notistack'

const DeleteTableModal = ({ isDeleteModalOpen, setIsDeleteModalOpen, tableToDelete, setTableToDelete }: { isDeleteModalOpen: boolean, setIsDeleteModalOpen: (value: boolean) => void, tableToDelete: { id: string, name: number } | null, setTableToDelete: (value: { id: string, name: number } | null) => void }) => {


    const { mutate: deleteMutate, isPending: isDeleting } = useQlMutation(deleteTable);
    const queryClient = useQueryClient();


    const closeDeleteModal = () => {
        setIsDeleteModalOpen(false);
        setTableToDelete(null);
    };

    const handleDelete = () => {
        if (!tableToDelete) return;
        deleteMutate({ deleteTableId: tableToDelete.id }, {
            onSuccess: (res) => {
                if (res.deleteTable.status === 200 || res.deleteTable.status === 201) {
                    enqueueSnackbar(res.deleteTable.message, { variant: "success" });
                    queryClient.refetchQueries({ queryKey: [TABLES] });
                    closeDeleteModal();
                } else {
                    enqueueSnackbar(res.deleteTable.message, { variant: "error" });
                }
            },
            onError: (error: any) => {
                enqueueSnackbar(error.response?.errors?.[0]?.message || "Failed to delete table", { variant: "error" });
            }
        });
    };
    return (
        <>
            <Modal isOpen={isDeleteModalOpen} onClose={closeDeleteModal} title="Confirm Deletion">
                <div className="flex flex-col p-2">
                    <p className="text-[#ababab] text-lg mb-6">
                        Are you sure you want to delete Table <span className="font-bold text-red-500">{tableToDelete?.name}</span> ?
                    </p>
                    <div className="flex w-full gap-4 mt-4">
                        <button
                            onClick={closeDeleteModal}
                            className="flex-1 bg-[#333] text-[#f5f5f5] py-3 rounded-lg hover:bg-[#444] cursor-pointer"
                            disabled={isDeleting}
                        >
                            Cancel
                        </button>
                        <button
                            onClick={handleDelete}
                            className="flex-1 bg-red-600 text-white py-3 rounded-lg hover:bg-red-700 cursor-pointer font-semibold"
                            disabled={isDeleting}
                        >
                            {isDeleting ? "Deleting..." : "Delete"}
                        </button>
                    </div>
                </div>
            </Modal>
        </>
    )
}

export default DeleteTableModal