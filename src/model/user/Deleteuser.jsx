import * as Dialog from '@radix-ui/react-dialog';
import { Button } from "../../components/ui/button";

const Deleteuser = ({ isModalOpen, closeModal, deleteUsersFetchHandler }) => {
    return (
        <Dialog.Root open={isModalOpen} onOpenChange={closeModal}> 
            <Dialog.Overlay className="dialog-overlay" /> 
            <Dialog.Content className="dialog-content">
                <div className="my-2 text-center">
                    <p className='my-3' >Are you sure you want to delete this user?</p>


                    <Button onClick={() => {
                        deleteUsersFetchHandler()
                        closeModal()
                    }
                    } className="sm-w-[100%] mx-2 bg-green-800">
                        Yes
                    </Button>

                    <Button onClick={() => closeModal()} className="sm-w-[100%]">
                        No
                    </Button>

                </div>
            </Dialog.Content>
        </Dialog.Root>
    );
}

export default Deleteuser;
