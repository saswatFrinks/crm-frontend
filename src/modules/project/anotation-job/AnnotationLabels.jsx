import React, { useEffect } from 'react';

import { useRecoilState, useRecoilValue, useSetRecoilState } from 'recoil';
import Select from '@/shared/ui/Select';
import { Edit, Trash } from 'react-feather';
import {
  annotationClassesAtom,
  annotationMapAtom,
  currentLabelIdAtom,
  currentRectangleIdAtom,
  editingAtom,
  labelEditedAtom,
  rectanglesAtom,
  selectedFileAtom,
  uploadedFileListAtom,
} from '../state';
import { RECTANGLE_TYPE } from '@/core/constants';
import { initialLabelsAtom } from '../assembly/state';
import toast from 'react-hot-toast';

export default function AnnotationLabels({ labelClass }) {
  const selectedImage = useRecoilValue(selectedFileAtom);
  const [annotMap, setAnnotMap] = useRecoilState(annotationMapAtom);
  const selectedRectangleId = useSetRecoilState(currentRectangleIdAtom);
  const selecteFile = useRecoilValue(selectedFileAtom);
  const [annotationClasses, setAnnotationClasses] = useRecoilState(
    annotationClassesAtom
  );

  const [isEditing, setIsEditing] = useRecoilState(editingAtom);
  const [labelId, setLabelId] = useRecoilState(currentLabelIdAtom);

  // const [initialLabels, setInitialLabels] = useRecoilState(initialLabelsAtom);
  // console.log("annotatio1n",{initialLabels})

  const selectedImageId = selecteFile?.id;

  let labels = selectedImageId
    ? [...(annotationClasses[selectedImageId]?.rectangles || [])]
    : [];

  if (annotationClasses[selectedImageId]?.polygons?.length > 0) {
    const polygons = annotationClasses[selectedImageId]?.polygons || [];
    labels = labels.concat(polygons);
  }

  const rectangles = selectedImageId
    ? annotationClasses[selectedImageId]?.rectangles || []
    : [];

  const polygons = selectedImageId
    ? annotationClasses[selectedImageId]?.polygons || []
    : [];

  // useEffect(() => {
  //   setInitialLabels(rectangles)
  // }, [])

  const remove = (id, uuid) => {
    let newMap = Object.assign({}, annotMap);
    delete newMap[uuid];
    setAnnotMap(newMap);
    setAnnotationClasses((prev) => ({
      ...prev,
      [selectedImageId]: {
        ...prev[selectedImageId],
        changed: true,
        rectangles: prev[selectedImageId].rectangles.filter(
          (e) => e.uuid !== uuid
        ),
        polygons: prev[selectedImageId].polygons.filter((e) => e.uuid !== uuid),
      },
    }));
  };

  const selectClass = (id) => {};
  return (
    <div>
      <p className="mb-4 break-all pr-2 mt-2">
        Current labels for{' '}
        <span className="font-semibold">{selectedImage?.name}</span>
      </p>
      <div
        className="flex h-[calc(100vh-478px)] flex-col gap-2 overflow-y-auto"
        onClick={() => selectClass('id')}
      >
        {labels.map((t, i) => (
          <div
            key={i}
            className="flex cursor-pointer items-center gap-4 px-4  py-1.5 duration-100 hover:bg-gray-100"
          >
            <span>{i + 1}.</span>
            <div className=" flex grow justify-center">
              <div
                className={`w-full max-w-sm ${labelId === t.uuid ? 'rounded-lg border border-blue-700' : ''}`}
              >
                <Select
                  size="xs"
                  options={labelClass}
                  value={annotMap[t.uuid]}
                  disabled={isEditing ? true : false}
                  onChange={(e) => {
                    let ind = rectangles.findIndex((ele) => ele.uuid == t.uuid);

                    if (ind !== -1) {
                      const recCp = [...rectangles];
                      const label = labelClass.find(
                        (ele) => ele.id == e.target.value
                      );
                      recCp[ind] = {
                        ...recCp[ind],
                        title: label.name,
                        stroke: label.color,
                        fill: label.color,
                      };
                      setAnnotationClasses((prev) => ({
                        ...prev,
                        [selectedImageId]: {
                          ...prev[selectedImageId],
                          rectangles: recCp,
                          changed: true,
                        },
                      }));
                    } else {
                      ind = polygons.findIndex((ele) => ele.uuid == t.uuid);
                      const polCp = [...polygons];
                      const label = labelClass.find(
                        (ele) => ele.id == e.target.value
                      );
                      polCp[ind] = {
                        ...polCp[ind],
                        title: label.name,
                        stroke: label.color,
                        fill: label.color,
                      };
                      setAnnotationClasses((prev) => ({
                        ...prev,
                        [selectedImageId]: {
                          ...prev[selectedImageId],
                          polygons: polCp,
                          changed: true,
                        },
                      }));
                    }

                    setAnnotMap((p) => ({ ...p, [t.uuid]: e.target.value }));
                  }}
                />
              </div>
            </div>
            <Edit
              size={18}
              className="mr-4 cursor-pointer"
              onClick={() => {
                if (isEditing) {
                  toast(
                    'Please confirm the creation of the new label first before proceeding',
                    {
                      icon: '⚠️',
                    }
                  );
                  return;
                }
                selectedRectangleId(t.uuid);
              }}
            />
            <Trash
              size={16}
              className="cursor-pointer"
              // onClick={() => remove(t.id, t.uuid)}
              onClick={() => {
                if (isEditing && labelId === t.uuid) {
                  remove(t.id, t.uuid);
                  setIsEditing(false);
                } else if (isEditing) {
                  toast(
                    'Please confirm the creation of the new label first before proceeding',
                    {
                      icon: '⚠️',
                    }
                  );
                } else {
                  remove(t.id, t.uuid);
                }
              }}
            />
          </div>
        ))}
      </div>
    </div>
  );
}
