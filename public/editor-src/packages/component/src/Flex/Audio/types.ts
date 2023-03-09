export interface Props {
  src: string;
  showCurrentTime: boolean;
  showDurationTime: boolean;
  showProgressBarTrack: boolean;
  showProgressBarVolume: boolean;
  classNameAudio: string;
  classNameControls: string;
  classNameIcon: string;
  isLoop?: boolean;
}
