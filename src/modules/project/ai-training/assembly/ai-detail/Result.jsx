import Pagination from '@/shared/ui/Pagination';
import Slider from '@/shared/ui/Slider';
import RecallChart from './RecallChart';
import MatrixChart from './MatrixChart';

export default function Result() {
  return (
    <div className="grid gap-4">
      <ul className="flex gap-12">
        <li>Training Data: 120 images</li>

        <li>Testing Data: 60 images</li>

        <li>Validation Data: 70 images</li>
      </ul>

      <h3 className="text-2xl font-semibold">Validation Results</h3>

      <p>
        Review the validation results properly before deploying the AI model.
        Compare the ground truth with prediction to check the model accuracy.
        You can adjust the confidence threshold and iou threshold to observe the
        changes in the model prediction. If the results are not satisfactory,
        retrain the model with more data on cases where it is currently failing
        or change the model parameters.
      </p>

      <div className="flex items-center justify-center gap-8">
        <figure className="flex w-full max-w-lg flex-col items-center ">
          <img
            className="h-80 w-full border border-black"
            src="/docs/images/examples/image-3@2x.jpg"
            alt="image description"
          />
          <figcaption className=" mt-2 text-center">Original</figcaption>
        </figure>

        <figure className="flex w-full max-w-lg flex-col items-center ">
          <img
            className="h-80 w-full border border-black"
            src="/docs/images/examples/image-3@2x.jpg"
            alt="image description"
          />
          <figcaption className="mt-2 text-center ">Prediction</figcaption>
        </figure>
      </div>

      <Pagination />

      <div className="flex flex-col items-center gap-4">
        <Slider title={'Confidence Threshold:'} id="confidence" />
        <Slider title={'IOU Threshold:'} id="iou" />
      </div>

      <h3 className="text-2xl font-semibold">Training Results</h3>

      <p>
        The below graphs helps you visualise the training results. You can
        understand the false positive and false negative of the trained model
        from the confusion matrix. And the precision-recall curve helps you
        understand the performance of the model. Click here to understand more
        about these two metrics.
      </p>

      <div className="flex items-center justify-center gap-4">
        <div className="w-full max-w-2xl">
          <MatrixChart />
        </div>

        <div className="w-full max-w-2xl">
          <RecallChart />
        </div>
      </div>
    </div>
  );
}
