import { Response } from "../types/Response";

export interface FeaturedImage {
  updateFeaturedImage: (
    res: Response<{ uid: string }>,
    rej: Response<string>,
    attachmentId: string
  ) => void;
  updateFeaturedImageFocalPoint: (
    res: Response<[]>,
    rej: Response<string>,
    data: UpdateFeaturedImageFocalPointProps
  ) => void;
  removeFeaturedImage: (
    res: Response<undefined>,
    rej: Response<string>
  ) => void;
}

interface UpdateFeaturedImageFocalPointProps {
  attachmentId: string;
  pointX: string;
  pointY: string;
}
