import Heading from '@/shared/layouts/main/heading';
import Drawer from '@/shared/ui/Drawer';
import Project from '@/modules/project/components/ProjectCard';
import React from 'react';
import CreateProjectDrawer from './components/CreateProjectDrawer';
import Modal, { ModalBody, ModalFooter, ModalHeader } from '@/shared/ui/Modal';
import { useSetRecoilState } from 'recoil';
import { modalAtom } from '@/shared/states/modal.state';
import Button from '@/shared/ui/Button';
import ProjectCreateLoader from '@/shared/ui/ProjectCreateLoader';
import axiosInstance from '@/core/request/aixosinstance';
import { getOrganizationId } from '@/util/util';
import storageService from '@/core/storage';

export default function Home() {
  const [open, setOpenDrawer] = React.useState(false);
  const [showLoader, setShowLoader] = React.useState(false);
  const [projects, setProjects] = React.useState([]);
  const [projectEditIndex, setProjectEditIndex] = React.useState(null);
  const [projectForDelete, setProjectForDelete] = React.useState(null);

  const fetchAllProjects = async () => {
    const paramObj = {};
    const user = JSON.parse(storageService.get('user'));

    if (user.plantId) {
      paramObj['plantId'] = user.plantId;
    } else if (user.teamId) {
      paramObj['teamId'] = user.teamId;
    } else {
      paramObj['organizationId'] = getOrganizationId();
    }

    const res = await axiosInstance.get('/project/fetch', {
      params: paramObj,
    });

    setProjects(res.data.data);
  };

  const deleteProject = async () => {
    if (projectForDelete) {
      await axiosInstance.delete('/project', {
        params: {
          projectId: projectForDelete.id,
        },
      });

      setProjectForDelete(null);
      fetchAllProjects();
      setOpenModal(false);
    }
  };

  React.useEffect(() => {
    fetchAllProjects();
  }, []);

  const setOpenModal = useSetRecoilState(modalAtom);

  const ref = React.useRef();

  const closeDrawer = () => {
    setOpenDrawer(false);
    setProjectEditIndex(null);
  };

  const openDrawer = () => {
    setOpenDrawer(true);
  };

  const handleProjectEdit = (index) => {
    setProjectEditIndex(index);
    openDrawer();
  }

  return (
    <>
      <Modal>
        <ModalHeader>Confirmation Message</ModalHeader>

        <ModalBody>
          <p>
            The project{' '}
            <span className="font-semibold">{projectForDelete?.name}</span> and
            assosiated date will be permanently deleted, do you want to
            continue?
          </p>
        </ModalBody>

        <ModalFooter>
          <div className="ml-auto flex w-2/3 items-center gap-4">
            <Button size="xs" color="flat" onClick={() => setOpenModal(false)}>
              Cancel
            </Button>
            <Button
              size="xs"
              onClick={() => {
                deleteProject();
              }}
            >
              Delete
            </Button>
          </div>
        </ModalFooter>
      </Modal>

      <Heading>Project</Heading>

      <div className="flex flex-wrap gap-6 p-10">
        <Project.Create onClick={openDrawer} />
        {projects.map((project,i) => (
          <Project.Card
            key={project.id}
            project={project}
            setProjectForDelete={setProjectForDelete}
            handleEdit={handleProjectEdit}
            editIndex={i}
          />
        ))}
      </div>

      {open && <Drawer
        isOpen={open}
        handleClose={closeDrawer}
        title={(projectEditIndex != null) ? 'Edit Project ' : 'Create a new project'}
        footer={
          <div className="flex  items-end justify-end gap-4 ">
            <Button
              size="xs"
              color="flat"
              fullWidth={false}
              className="min-w-[150px]"
              onClick={closeDrawer}
            >
              Cancel
            </Button>
            <Button
              size="xs"
              fullWidth={false}
              className="min-w-[150px]"
              onClick={() => ref.current?.submitForm()}
            >
              Create Project
            </Button>
          </div>
        }
      >
        <CreateProjectDrawer
          ref={ref}
          closeDrawer={closeDrawer}
          setShowLoader={setShowLoader}
          fetchAllProjects={fetchAllProjects}
          projectToEdit={projects[projectEditIndex]}
        />
        {showLoader && <ProjectCreateLoader />}
      </Drawer>}
    </>
  );
}
