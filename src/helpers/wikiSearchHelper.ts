import wiki from 'wikipedia';
import ApiError from '../errors/ApiError';
import { StatusCodes } from 'http-status-codes';
import path from 'path';

const wikiSearchService = async (
  searchTerm: string,
  keyword: string[] = []
) => {
  const search = await wiki.search(searchTerm?.toLowerCase(), { limit: 10 });

  const searchData = search.results.filter(
    item =>
      !keyword.length ||
      item.title
        ?.toLowerCase()
        ?.split(' ')
        ?.some((item2: any) => keyword?.includes(item2))
  );

  if (searchData.length === 0) {
    throw new ApiError(StatusCodes.BAD_REQUEST, 'No data found');
  }
  const item = searchData[0];

  const details = await wiki.page(item.pageid);
  const links = await details.fullurl;


  const data2 = {
    name: item.title,
    link: links,
  };

  return data2?.link;
};

export const searchHelper = {
  wikiSearchService,
};
