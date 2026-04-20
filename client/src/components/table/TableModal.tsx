import Modal from '../shared/Modal'


import { enqueueSnackbar } from "notistack";
import { useQueryClient } from "@tanstack/react-query";
import { useQlMutation } from "../../graphql/globalRequest";
import { TABLES } from "../../tanstackKeys";

import { createTable, updateTable } from '../../graphql/query/table';



const TableModal = ({ register, handleSubmit, reset, errors, isModalOpen, setIsModalOpen, editTableId, setEditTableId }: { register: any, handleSubmit: any, reset: any, errors: any, isModalOpen: boolean, setIsModalOpen: (value: boolean) => void, editTableId: string | null, setEditTableId: (value: string | null) => void }) => {

    const { mutate, isPending } = useQlMutation(createTable);
    const { mutate: updateMutate, isPending: isUpdating } = useQlMutation(updateTable);


    const queryClient = useQueryClient();




    const closeModal = () => {
        setIsModalOpen(false);
        setEditTableId(null);
        reset({ tableNumber: NaN, capacity: NaN });
    };

    const onSubmit = (data: { tableNumber: number; capacity: number }) => {
        if (editTableId) {
            updateMutate(
                { updateTableId: editTableId, tableNumber: data.tableNumber, capacity: data.capacity },
                {
                    onSuccess: (res) => {
                        if (res.updateTable.status === 200 || res.updateTable.status === 201) {
                            enqueueSnackbar(res.updateTable.message, { variant: "success" });
                            queryClient.refetchQueries({ queryKey: [TABLES] });
                            closeModal();
                        } else {
                            enqueueSnackbar(res.updateTable.message, { variant: "error" });
                        }
                    },
                    onError: (error: any) => {
                        enqueueSnackbar(error.response?.errors?.[0]?.message || "Failed to update table", { variant: "error" });
                    },
                }
            );
        } else {
            mutate(data, {
                onSuccess: (res) => {
                    if (res.createTable.status === 200 || res.createTable.status === 201) {
                        enqueueSnackbar(res.createTable.message, { variant: "success" });
                        queryClient.refetchQueries({
                            queryKey: [TABLES],
                        });
                        closeModal();
                    } else {
                        enqueueSnackbar(res.createTable.message, { variant: "error" });
                    }
                },
                onError: (error: any) => {
                    enqueueSnackbar(error.response?.errors?.[0]?.message || "Failed to create table", { variant: "error" });
                }
            });
        }
    };
    return (
        <>
            <Modal isOpen={isModalOpen} onClose={closeModal} title={editTableId ? "Edit Table" : "Create Table"} >
                <form onSubmit={handleSubmit(onSubmit)}>
                    <div>
                        <label className="block text-sm font-semibold text-[#adaaaa] mb-1">
                            Table Number
                        </label>
                        <input
                            {...register("tableNumber", { valueAsNumber: true })}
                            type="number"
                            placeholder="Enter table number"
                            className="w-full bg-[#131313] text-[#f5f5f5] px-4 py-3 rounded-xl border border-white/5 focus:border-[#ffd16c]/30 outline-none transition-all placeholder:text-[#333]"
                        />
                        {errors.tableNumber && (
                            <p className="text-red-400 text-xs mt-1">{errors.tableNumber.message}</p>
                        )}
                    </div>
                    <div>
                        <label className="block text-[#ababab] mb-2 mt-3 text-sm font-medium">
                            Capacity
                        </label>
                        <input
                            {...register("capacity", { valueAsNumber: true })}
                            type="number"
                            placeholder="Enter capacity"
                            className="w-full bg-[#131313] text-[#f5f5f5] px-4 py-3 rounded-xl border border-white/5 focus:border-[#ffd16c]/30 outline-none transition-all placeholder:text-[#333]"
                        />
                        {errors.capacity && (
                            <p className="text-red-500 text-sm mt-1">{errors.capacity.message}</p>
                        )}
                    </div>


                    <div className="mt-4 flex justify-end gap-3">
                        <button
                            type="button"
                            onClick={closeModal}
                            className="px-6 py-2.5 rounded-xl border border-white/10 text-[#adaaaa] hover:bg-white/5 transition-colors font-medium cursor-pointer"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={isPending || isUpdating}
                            className="px-6 py-2.5 rounded-xl bg-[#F6B100] hover:bg-[#fdc003] text-white font-bold shadow-[0_0_20px_rgba(255,209,108,0.2)] transition-all cursor-pointer flex items-center justify-center min-w-[120px]"
                        >
                            {isPending || isUpdating ? (editTableId ? "Updating..." : "Creating...") : (editTableId ? "Update Table" : "Create Table")}
                        </button>
                    </div>
                </form>
            </Modal>
        </>
    )
}

export default TableModal