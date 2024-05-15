import axiosInstance from '@/core/request/aixosinstance';
import ArrowRight from '@/shared/icons/ArrowRight';
import Heading from '@/shared/layouts/main/heading'
import React from 'react'
import { Link, Outlet, useParams } from 'react-router-dom'

const InstanceLayout = () => {
  const params = useParams();
  const [project, setProject] = React.useState(null);

  const fetchProject = async () => {
    try {
      const res = await axiosInstance.get('/project', {
        params: {
          projectId: params.projectId,
        },
      })
      setProject(res?.data?.data);
    } catch (error) {
      toast.error(error?.response?.data?.data?.message || 'Cannot fetch project details');
    }
  };

  React.useEffect(() => {
    fetchProject()
  }, [])

  return (
    <>
      <Heading
        subcontent={
          <>
            <Link
              to={`/project/${params.projectId}`}
              className="flex items-center gap-2"
            >
              <ArrowRight />
              <span>{project?.name || 'Project Name'}</span>
            </Link>
          </>
        }
      >
        Project
      </Heading>
      <div className="flex h-[calc(100vh-56px)]">
        <div className="flex-1 overflow-y-auto px-10 py-8">
          <Outlet />
        </div>
      </div>
    </>
  )
}

export default InstanceLayout
