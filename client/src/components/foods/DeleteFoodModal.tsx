import Modal from '../shared/Modal'
import { useQlMutation } from '../../graphql/globalRequest'
import { useQueryClient } from '@tanstack/react-query'
import { FOODS } from '../../tanstackKeys'
import { enqueueSnackbar } from 'notistack'
import { deleteFood } from '../../graphql/query/food'

interface DeleteFoodModalProps {
    isDeleteModalOpen: boolean;
    setIsDeleteModalOpen: (value: boolean) => void;
    foodToDelete: { id: string, name: string } | null;
    setFoodToDelete: (value: { id: string, name: string } | null) => void;
}

const DeleteFoodModal = ({
    isDeleteModalOpen,
    setIsDeleteModalOpen,
    foodToDelete,
    setFoodToDelete
}: DeleteFoodModalProps) => {
    const { mutate: deleteMutate, isPending: isDeleting } = useQlMutation(deleteFood);
    const queryClient = useQueryClient();

    const closeDeleteModal = () => {
        setIsDeleteModalOpen(false);
        setFoodToDelete(null);
    };

    const handleDelete = () => {
        if (!foodToDelete) return;
        deleteMutate({ deleteFoodId: foodToDelete.id }, {
            onSuccess: (res) => {
                if (res.deleteFood.status === 200 || res.deleteFood.status === 201) {
                    enqueueSnackbar(res.deleteFood.message, { variant: "success" });
                    queryClient.refetchQueries({ queryKey: [FOODS] });
                    closeDeleteModal();
                } else {
                    enqueueSnackbar(res.deleteFood.message, { variant: "error" });
                }
            },
            onError: (error: any) => {
                enqueueSnackbar(error.response?.errors?.[0]?.message || "Failed to delete food", { variant: "error" });
            }
        });
    };

    return (
        <Modal isOpen={isDeleteModalOpen} onClose={closeDeleteModal} title="Confirm Deletion">
            <div className="flex flex-col p-2">
                <p className="text-[#ababab] text-lg mb-6">
                    Are you sure you want to delete Food <span className="font-bold text-red-500">{foodToDelete?.name}</span> ?
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
                        className="flex-1 bg-red-600 text-white py-3 rounded-lg hover:bg-red-700 cursor-pointer font-semibold transition-colors"
                        disabled={isDeleting}
                    >
                        {isDeleting ? "Deleting..." : "Delete"}
                    </button>
                </div>
            </div>
        </Modal>
    );
};

export default DeleteFoodModal;
