import { ActionTypes, ReduxAction } from "visual/redux/actions2";
import { ReduxState } from "visual/redux/types";
import { NonEmptyArray } from "visual/utils/array/types";

type CurrentStyle = ReduxState["currentStyle"];
type RCurrentStyle = (
  s: CurrentStyle,
  a: ReduxAction,
  f: ReduxState
) => CurrentStyle;

export const currentStyle: RCurrentStyle = (state, action, fullState) => {
  switch (action.type) {
    case "HYDRATE": {
      const { project } = action.payload;
      const styles = [
        ...project.data.styles,
        ...(project.data.extraStyles ?? [])
      ] as NonEmptyArray<CurrentStyle>;

      const style = styles.find(
        (style) => style.id === project.data.selectedStyle
      );

      return style ?? styles[0];
    }
    case ActionTypes.UPDATE_CURRENT_STYLE: {
      return action.payload;
    }
    case ActionTypes.UPDATE_CURRENT_STYLE_ID: {
      const currentStyleId = action.payload;
      const styles = [
        ...fullState.styles,
        ...(fullState.extraStyles ?? [])
      ] as NonEmptyArray<CurrentStyle>;
      const style = styles.find(({ id }) => id === currentStyleId);

      return style ?? styles[0];
    }
    case ActionTypes.ADD_NEW_GLOBAL_STYLE: {
      return action.payload;
    }
    case ActionTypes.REMOVE_GLOBAL_STYLE: {
      return fullState.styles[0] as CurrentStyle;
    }
    case ActionTypes.IMPORT_STORY:
    case ActionTypes.IMPORT_TEMPLATE: {
      const { currentStyleId, styles } = action.payload;
      const allStyles = [
        ...(styles ?? []),
        ...fullState.styles,
        ...fullState.extraStyles
      ] as NonEmptyArray<CurrentStyle>;

      const style = currentStyleId
        ? allStyles.find((style) => style.id === currentStyleId)
        : state;
      return style ?? state;
    }
    case ActionTypes.EDIT_GLOBAL_STYLE_NAME: {
      return { ...state, title: action.payload };
    }
    case ActionTypes.REGENERATE_TYPOGRAPHY:
    case ActionTypes.REGENERATE_COLORS: {
      return action.payload;
    }
    default:
      return state;
  }
};
