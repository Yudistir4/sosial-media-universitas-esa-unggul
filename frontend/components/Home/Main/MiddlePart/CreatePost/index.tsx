import {
  Modal,
  ModalContent,
  ModalOverlay,
  Tab,
  TabList,
  TabPanel,
  TabPanels,
  Tabs,
} from '@chakra-ui/react';

import { useCreatePostModal } from '@/store/createPostModal';
import * as React from 'react';
import PostForm from './PostForm';
import QuestionForm from './QuestionForm';
import Polling from './Polling';
import { useSelectVoters } from '@/store/selectVoters';

interface ICreatePostProps {}

const CreatePost: React.FunctionComponent<ICreatePostProps> = (props) => {
  const { isOpen, onClose, to_user } = useCreatePostModal((state) => ({
    isOpen: state.isOpen,
    onClose: state.onClose,
    to_user: state.to_user,
  }));
  const [fileExist, setFileExist] = React.useState(false);

  const [tabIndex, setTabIndex] = React.useState(0);
  const removeVoters = useSelectVoters((state) => state.removeVoters);
  const closeModal = () => {
    setFileExist(false);
    removeVoters();
    onClose();
  };
  return (
    <>
      <Modal
        onClose={closeModal}
        isOpen={isOpen}
        isCentered
        size={tabIndex === 1 ? 'md' : fileExist ? '3xl' : 'md'}
      >
        <ModalOverlay />
        <ModalContent width="100%" mx={2} className="overflow-hidden">
          {/* <ModalHeader className="text-center">Create Post</ModalHeader> */}
          <Tabs
            isFitted
            onChange={(index) => setTabIndex(index)}
            defaultIndex={to_user ? 1 : 0}
          >
            <TabList>
              <Tab>Add Post</Tab>
              <Tab>Add Question</Tab>
              <Tab>Add Polling</Tab>
            </TabList>

            <TabPanels>
              <TabPanel>
                <PostForm onClose={closeModal} setFileExist={setFileExist} />
              </TabPanel>
              <TabPanel>
                <QuestionForm onClose={closeModal} to_user={to_user} />
              </TabPanel>
              <TabPanel>
                <Polling onClose={closeModal} />
              </TabPanel>
            </TabPanels>
          </Tabs>
        </ModalContent>
      </Modal>
    </>
  );
};

export default CreatePost;
