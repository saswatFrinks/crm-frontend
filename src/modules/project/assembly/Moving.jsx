import ArrowUp from '@/shared/ui/ArrowUp';
import Button from '@/shared/ui/Button';
import Checkbox from '@/shared/ui/Checkbox';
import Hr from '@/shared/ui/Hr';
import Input from '@/shared/ui/Input';
import Label from '@/shared/ui/Label';
import Pen from '@/shared/ui/Pen';
import Radio from '@/shared/ui/Radio';
import Select from '@/shared/ui/Select';

import React from 'react';
import { ChevronDown, Plus, Trash } from 'react-feather';

const DEFAULT_ROI = {
  id: 1,
  objectName: '',
  class: '',
  operation: '',
  qty: '',
  classify: false,
  checked: false,
};

export default function Moving() {
  const [configuration, setConfiguration] = React.useState({
    productFlow: 'up',
    primaryObject: '',
    primaryObjectClass: '',
    rois: [DEFAULT_ROI],
  });

  const addObject = () => {
    setConfiguration((t) => ({
      ...t,
      rois: [
        ...t.rois,
        {
          ...DEFAULT_ROI,
          id: Date.now(),
        },
      ],
    }));
  };

  const deleteObject = (id) => {
    setConfiguration((t) => ({
      ...t,
      rois: t.rois.filter((k) => k.id !== id),
    }));
  };

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center gap-4">
        <Label main={false}>Product Flow:</Label>

        <div className="flex items-center gap-2">
          <Radio
            name="productFlow"
            value="up"
            checked={configuration.productFlow == 'up'}
            onChange={(e) =>
              setConfiguration((t) => ({
                ...t,
                productFlow: e.target.value,
              }))
            }
          />
          <ArrowUp />
        </div>
        <div className="flex items-center gap-2">
          <Radio
            name="productFlow"
            value="down"
            checked={configuration.productFlow == 'down'}
            onChange={(e) =>
              setConfiguration((t) => ({
                ...t,
                productFlow: e.target.value,
              }))
            }
          />
          <ArrowUp className="rotate-180" />
        </div>
        <div className="flex items-center gap-2">
          <Radio
            name="productFlow"
            value="left"
            checked={configuration.productFlow == 'left'}
            onChange={(e) =>
              setConfiguration((t) => ({
                ...t,
                productFlow: e.target.value,
              }))
            }
          />
          <ArrowUp className="-rotate-90" />
        </div>
        <div className="flex items-center gap-2">
          <Radio
            name="productFlow"
            value="right"
            checked={configuration.productFlow == 'right'}
            onChange={(e) =>
              setConfiguration((t) => ({
                ...t,
                productFlow: e.target.value,
              }))
            }
          />
          <ArrowUp className="rotate-90" />
        </div>
      </div>

      <div className="flex items-center gap-2">
        <Label main={false}>Primary Object:</Label>
        <div className="ml-16 w-44">
          <Input
            placeholder="Enter primary object"
            size="xs"
            onChange={(e) => {
              setConfiguration((t) => ({
                ...t,
                primaryObject: e.target.value,
              }));
            }}
          />
        </div>
      </div>

      <div className="flex items-center gap-2">
        <Label main={false}>Primary Object Class:</Label>
        <div className="ml-6 w-44 max-w-xs">
          <Select size="xs" placeholder="Select class" />
        </div>
      </div>

      <Hr />

      {configuration.rois.map((t, i) => (
        <div key={t}>
          <div className="flex items-center gap-4">
            <Checkbox
              id={t.id}
              value={t.id}
              checked={t.checked}
              onChange={() =>
                setConfiguration((configuration) => ({
                  ...configuration,
                  rois: configuration.rois.map((k) => ({
                    ...k,
                    checked: t.id == k.id ? !k.checked : k.checked,
                  })),
                }))
              }
              htmlFor={t.id}
            />
            Roi {i + 1}
            <div className="flex-1">
              <Button size="xs" fullWidth={false}>
                <div className="flex items-center gap-2">
                  <Pen /> Label ROI
                </div>
              </Button>
            </div>
            <div className="flex w-[320px] items-center gap-4">
              <Button
                size="xs"
                variant="border"
                color="danger"
                onClick={() => deleteObject(t.id)}
              >
                <div className="flex items-center justify-center gap-2">
                  <Trash size={18} /> Delete object
                </div>
              </Button>
              <Button size="xs" variant="border" onClick={addObject}>
                <div className="flex items-center justify-center gap-2">
                  <Plus size={18} /> Add Object
                </div>
              </Button>
            </div>{' '}
            <ChevronDown size={24} className="cursor-pointer" />
          </div>
        </div>
      ))}
    </div>
  );
}
