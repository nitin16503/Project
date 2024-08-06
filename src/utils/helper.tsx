import jwt, { JwtPayload } from 'jsonwebtoken';
import Cookies from 'js-cookie';
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import timezone from 'dayjs/plugin/timezone';
import customParseFormat from 'dayjs/plugin/customParseFormat';

dayjs.extend(utc);
dayjs.extend(timezone);
dayjs.extend(customParseFormat);

export const decodeJwtWithoutVerification = (token: string): JwtPayload | null => {
  try {
    const decoded = jwt.decode(token, { complete: true }) as { payload: JwtPayload } | null;

    if (decoded) {
      const payload = decoded.payload;
      return payload;
    } else {
      console.error('Error decoding JWT:', 'Token could not be decoded.');
      return null;
    }
  } catch (error) {
    console.error('Error decoding JWT:', error);
    return null;
  }
};

export const getUserInfo = (key:string) =>{
  var userInfoString = Cookies.get('user');
  var userInfo = userInfoString ? JSON.parse(userInfoString) : {};
  var data = userInfo[key];
  return data
}

export const setUserInfo = (data:string)=>{
  Cookies.set('user', data, { expires: 7, secure: false, sameSite: 'strict' });
}

export const updateUserInfo = (key:string,value:string)=>{
  var existingUserInfoString = Cookies.get('user');
  var existingUserInfo = existingUserInfoString ? JSON.parse(existingUserInfoString) : {};
  existingUserInfo[key] = value;
  var updatedUserInfoString = JSON.stringify(existingUserInfo);
  Cookies.set('user', updatedUserInfoString, { expires: 7, secure: false, sameSite: 'strict' });
}

export const clearStorage = ()=>{
  Cookies.remove('user');
}

export const checkAuthentication = () => {
  const authToken = getUserInfo('token')
  const isAuthenticated = !!authToken;
  return isAuthenticated;
};

export const formatDateTime = (inputDateTime: string):string => {
  const formattedDateTime = dayjs(inputDateTime).format('DD/MM/YY - hh:mm A');
  return formattedDateTime;
};

export const getTime = (timestamp: string): string => {
  const givenDate = new Date(timestamp);
  const currentDate = new Date();
  const diffMilliseconds: number = currentDate.getTime() - givenDate.getTime();
  const diffMinutes = Math.floor(diffMilliseconds / (1000 * 60));
  const diffHours = Math.floor(diffMinutes / 60);
  const diffDays = Math.floor(diffHours / 24);
  const diffMonths = Math.floor(diffDays / (365.25 / 12)); // Average number of days in a month
  const diffYears = Math.floor(diffDays / 365.25); // Average number of days in a year
  let result: string;
  if (diffYears > 0) {
    result = `${diffYears} year${diffYears > 1 ? 's' : ''}`;
  } else if (diffMonths > 0) {
    result = `${diffMonths} month${diffMonths > 1 ? 's' : ''}`;
  } else if (diffDays > 0) {
    result = `${diffDays} day${diffDays > 1 ? 's' : ''}`;
  } else if (diffHours > 0) {
    result = `${diffHours} hour${diffHours > 1 ? 's' : ''}`;
  } else {
    result = `${diffMinutes} minute${diffMinutes > 1 ? 's' : ''}`;
  }
  return result;
}

export const capitalizeEachWord = (inputString: string): string => {
  return inputString.replace(/\b\w/g, function(match) {
    return match.toUpperCase();
  });
};

