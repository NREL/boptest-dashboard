import {SignatureDetails, Account} from './../../common/interfaces';
import express from 'express';

import {
  getSharedResultByUid,
  getSignatureDetailsForResult,
  createResults,
  toggleShared,
  getSharedResultsPage,
  getUserResultsPage,
} from '../controllers/result';
import {listResultFacets} from '../models/ResultFacet';
import {SharedResultFilters} from '../models/Result';
import {authorizer} from './authRoutes';
import {validateSessionCsrf} from '../utils/security';

type PrivilegedAccount = Account & {
  privileged?: boolean;
};

export const resultRouter = express.Router();

const parseNumber = (value: unknown): number | undefined => {
  if (typeof value !== 'string') {
    return undefined;
  }
  const parsed = parseFloat(value);
  return Number.isNaN(parsed) ? undefined : parsed;
};

const buildSharedResultFilters = (query: express.Request['query']): SharedResultFilters | undefined => {
  const filters: SharedResultFilters = {};

  if (typeof query.buildingTypeUid === 'string' && query.buildingTypeUid.trim().length > 0) {
    filters.buildingTypeUid = query.buildingTypeUid.trim();
  }
  if (typeof query.buildingTypeName === 'string' && query.buildingTypeName.trim().length > 0) {
    filters.buildingTypeName = query.buildingTypeName.trim();
  }

  const tagsParam = query.tags;
  if (typeof tagsParam === 'string') {
    const parsedTags = tagsParam
      .split(',')
      .map(tag => tag.trim())
      .filter(tag => tag.length > 0);
    if (parsedTags.length > 0) {
      filters.tags = parsedTags;
    }
  } else if (Array.isArray(tagsParam)) {
    const parsedTags = (tagsParam as unknown[])
      .map(tag => (typeof tag === 'string' ? tag.trim() : ''))
      .filter((tag): tag is string => tag.length > 0);
    if (parsedTags.length > 0) {
      filters.tags = parsedTags;
    }
  }

  const scenarioFilters: Record<string, string> = {};
  Object.entries(query).forEach(([key, value]) => {
    if (key.startsWith('scenario.') && typeof value === 'string' && value.length > 0) {
      const scenarioKey = key.substring('scenario.'.length);
      if (scenarioKey.length > 0) {
        scenarioFilters[scenarioKey] = value;
      }
    }
  });
  if (Object.keys(scenarioFilters).length > 0) {
    filters.scenario = scenarioFilters;
  }

  const assignRange = (
    targetKey: 'cost' | 'energy' | 'thermalDiscomfort' | 'aqDiscomfort' | 'emissions',
    minKey: string,
    maxKey: string
  ) => {
    const minValue = parseNumber(query[minKey]);
    const maxValue = parseNumber(query[maxKey]);
    if (minValue !== undefined || maxValue !== undefined) {
      filters[targetKey] = {
        ...(minValue !== undefined ? {min: minValue} : {}),
        ...(maxValue !== undefined ? {max: maxValue} : {}),
      };
    }
  };

  assignRange('cost', 'costMin', 'costMax');
  assignRange('energy', 'energyMin', 'energyMax');
  assignRange('thermalDiscomfort', 'thermalDiscomfortMin', 'thermalDiscomfortMax');
  assignRange('aqDiscomfort', 'aqDiscomfortMin', 'aqDiscomfortMax');
  assignRange('emissions', 'emissionsMin', 'emissionsMax');

  return Object.values(filters).some(value => value !== undefined) ? filters : undefined;
};

resultRouter.get('/', async (req: express.Request, res: express.Response) => {
  const {limit, cursor, sortDirection} = req.query;

  const parsedLimit = typeof limit === 'string' ? parseInt(limit, 10) : undefined;
  const parsedCursor = typeof cursor === 'string' ? parseInt(cursor, 10) : undefined;

  const sanitizedFilters = buildSharedResultFilters(req.query);
  if (process.env.NODE_ENV !== 'production') {
    console.log('My results filters', sanitizedFilters);
  }
  if (process.env.NODE_ENV !== 'production' && sanitizedFilters?.buildingTypeUid) {
    console.log('Shared results filter buildingTypeUid', sanitizedFilters.buildingTypeUid);
  }

  try {
    const page = await getSharedResultsPage({
      limit: parsedLimit && !Number.isNaN(parsedLimit) ? parsedLimit : 25,
      cursor: parsedCursor && !Number.isNaN(parsedCursor) ? parsedCursor : undefined,
      filters: sanitizedFilters,
      sortDirection:
        typeof sortDirection === 'string' && sortDirection.toLowerCase() === 'asc'
          ? 'asc'
          : 'desc',
    });

    res.json(page);
  } catch (err) {
    console.log('Unable to get results', err);
    res.status(500).json({error: 'Failed to load results'});
  }
});

resultRouter.get('/my-results', authorizer, async (req: express.Request, res: express.Response) => {
  const user = req.user as PrivilegedAccount | undefined;
  if (!user) {
    return res.status(401).json({error: 'Not authenticated'});
  }

  const {limit, cursor, sortDirection} = req.query;

  const parsedLimit = typeof limit === 'string' ? parseInt(limit, 10) : undefined;
  const parsedCursor = typeof cursor === 'string' ? parseInt(cursor, 10) : undefined;
  const sanitizedFilters = buildSharedResultFilters(req.query);

  try {
    const page = await getUserResultsPage({
      accountId: Number(user.id),
      limit: parsedLimit && !Number.isNaN(parsedLimit) ? parsedLimit : 50,
      cursor: parsedCursor && !Number.isNaN(parsedCursor) ? parsedCursor : undefined,
      filters: sanitizedFilters,
      sortDirection:
        typeof sortDirection === 'string' && sortDirection.toLowerCase() === 'asc'
          ? 'asc'
          : 'desc',
    });

    res.json(page);
  } catch (err) {
    console.error(`Unable to get results for user ID ${user.id}`, err);
    res.status(500).json({error: 'Failed to retrieve results'});
  }
});

resultRouter.get('/facets', (req: express.Request, res: express.Response) => {
  listResultFacets()
    .then(facets => res.json(facets))
    .catch(err => {
      console.error('Unable to list result facets', err);
      res.status(500).json({error: 'Failed to load result facets'});
    });
});

resultRouter.get('/uid/:uid', async (req: express.Request, res: express.Response) => {
  try {
    const result = await getSharedResultByUid(req.params.uid);
    if (!result) {
      res.status(404).json({error: 'Result not found'});
      return;
    }
    res.json(result);
  } catch (err) {
    console.error(`Unable to get result ${req.params.uid}`, err);
    res.status(500).json({error: 'Failed to load result'});
  }
});

resultRouter.get(
  '/:id/signature',
  (req: express.Request, res: express.Response) => {
    getSignatureDetailsForResult(req.params.id)
      .then((result: SignatureDetails) => {
        res.json(result);
      })
      .catch(err => console.log('Unable to get signature for result', err));
  }
);

resultRouter.post('/', (req: express.Request, res: express.Response) => {
  createResults(req.body.results)
    .then((responses: any) => {
      const fulfilled = responses
        .filter((response: any) => response.status === 'fulfilled')
        .map((response: any) => response.value);
      const rejected = responses
        .filter((response: any) => response.status === 'rejected')
        .map((response: any) => response.reason);
      const status = rejected.length <= 0 ? 200 : 400;
      res.status(status).send({fulfilled, rejected});
    })
    .catch(err => res.status(500).json(err));
});

resultRouter.patch('/share', authorizer, (req: express.Request, res: express.Response) => {
  const user = req.user as PrivilegedAccount | undefined;
  if (!user) {
    return res.status(401).json({error: 'Not authenticated'});
  }

  if (!validateSessionCsrf(req, res)) {
    return;
  }

  toggleShared(req.body.id, req.body.share, user.id)
    .then(() => {
      res.sendStatus(200);
    })
    .catch(err => {
      res.status(500).json(err);
    });
});
