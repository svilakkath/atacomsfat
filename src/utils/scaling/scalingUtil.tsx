import {
  moderateScale as smModerateScale,
  moderateVerticalScale as smModerateVerticalScale,
  scale as smScale,
  verticalScale as smVerticalScale,
} from 'react-native-size-matters';

export function scale(size: number): number {
  return smScale(size);
}

export function verticalScale(size: number): number {
  return smVerticalScale(size);
}

export function moderateScale(size: number, factor = 0.5): number {
  return smModerateScale(size, factor);
}

export function moderateVerticalScale(size: number, factor = 0.5): number {
  return smModerateVerticalScale(size, factor);
}
