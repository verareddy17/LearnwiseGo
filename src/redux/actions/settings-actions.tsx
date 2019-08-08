import { LOAD_USER_SUCCESS, LOAD_USER_START, LOAD_USER_FAILURE, LOAD_SETTINGS_START, LOAD_SETTINGS_SUCCESS, LOAD_SETTINGS_FAIL } from './action-types';
import { Data, ApiResponse } from '../../models/response-model';
import ApiManager from '../../manager/api-manager';
import { Dispatch } from 'redux';
import Config from 'react-native-config';
import { Constant } from '../../constant';
import { CustomizeSettings, Setting } from '../../models/custom-settings';

export const loadUserRequest = () => {
    return {
        type: LOAD_USER_START,
    };
};
export const loadUserSuccess = (data: CustomizeSettings) => {
    return {
        type: LOAD_USER_SUCCESS,
        payload: data,
    };
};
export const loadUserFailed = (error: string) => {
    return {
        type: LOAD_USER_FAILURE,
        payload: error,
    };
};

export class SettingsResponse {
    public settings = new CustomizeSettings();
    public isLoading: boolean = false;
    public error: string = '';
}

export default function deviceTokenApi(DeviceToken: string, ThemeVersion: number, DeviceOs: number, token: string): (dispatch: Dispatch) => Promise<void> {
    return async (dispatch: Dispatch) => {
        dispatch(loadUserRequest());
        await ApiManager.post<ApiResponse<Setting<CustomizeSettings>>>(`${Config.BASE_URL}/${Constant.deviceTokenUrl}`, { 'DeviceToken': DeviceToken, 'ThemeVersion': ThemeVersion, 'DeviceOs': DeviceOs }, token, (data, err, isNetworkFail) => {
            if (!isNetworkFail) {
                if (data) {
                    if (data.Success) {
                        dispatch(loadUserSuccess(data.Data.Settings));
                    } else {
                        try {
                            let error = data.Errors[0];
                            dispatch(loadUserFailed(error));
                        } catch {
                            dispatch(loadUserFailed('Network request failed'));
                        }
                    }
                } else {
                    dispatch(loadUserFailed('Network request failed'));
                }

            } else {
                dispatch(loadUserFailed('Please check internet connection'));
            }
        });
    };
}