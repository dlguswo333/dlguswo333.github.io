import {error} from '@sveltejs/kit';

export const getCurrentPaginationIndex = (url: URL) => {
  const {pathname} = url;
  if (pathname === '/') {
    return 1;
  }
  const result = /$\/posts\/(\d+)/.exec(pathname);
  if (!result) {
    error(404);
  }
  const paginationNumber = Number([...result][1]);
  if (Number.isNaN(paginationNumber) ||
    !Number.isInteger(paginationNumber) ||
    paginationNumber <= 0
  ) {
    error(404);
  }
  return paginationNumber;
};
