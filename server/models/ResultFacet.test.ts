import {upsertResultFacet} from './ResultFacet';

jest.mock('../datastore/documentStore', () => ({
  getDocumentStore: jest.fn(),
}));

const {getDocumentStore} = jest.requireMock('../datastore/documentStore') as {
  getDocumentStore: jest.Mock;
};

describe('upsertResultFacet', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('merges duplicates and removes extras before returning the consolidated facet', async () => {
    const queryMock = jest
      .fn()
      .mockResolvedValueOnce({})
      .mockResolvedValueOnce({rowCount: 0})
      .mockResolvedValueOnce({
        rowCount: 1,
        rows: [
          {
            doc_id: 'doc-1',
            collection: 'resultFacets',
            numeric_id: 10,
            data: {
              buildingTypeUid: 'buildingType-1',
              buildingTypeName: 'BIG building',
              scenario: {
                electricityPrice: ['dynamic'],
                timePeriod: ['heating peak'],
              },
              tags: ['comfort', 'optimized'],
              versions: ['0.1.0'],
            },
            created_at: '2024-01-01T00:00:00.000Z',
            updated_at: '2024-02-01T00:00:00.000Z',
          },
        ],
      })
      .mockResolvedValueOnce({
        rowCount: 1,
        rows: [
          {
            doc_id: 'doc-1',
            collection: 'resultFacets',
            numeric_id: 10,
            data: {
              buildingTypeUid: 'buildingType-1',
              buildingTypeName: 'BIG building',
              scenario: {
                electricityPrice: ['dynamic', 'highly dynamic'],
                timePeriod: ['cooling peak', 'heating peak'],
                temperature_uncertainty: ['low', 'high'],
              },
              tags: ['comfort', 'optimized', 'weekend'],
              versions: ['0.1.0', '0.2.0'],
            },
            created_at: '2024-01-01T00:00:00.000Z',
            updated_at: '2024-02-02T00:00:00.000Z',
          },
        ],
      })
      .mockResolvedValueOnce({});

    const releaseMock = jest.fn();

    getDocumentStore.mockResolvedValue({
      getPool: () => ({
        connect: () => ({query: queryMock, release: releaseMock}),
      }),
    });

    const result = await upsertResultFacet(
      'buildingType-1',
      'BIG building',
      {
        temperature_uncertainty: ['medium'],
        solar_uncertainty: ['low'],
      },
      ['comfort', 'weekend'],
      '0.2.0'
    );

    expect(result).toEqual({
      buildingTypeUid: 'buildingType-1',
      buildingTypeName: 'BIG building',
      scenario: {
        electricityPrice: ['dynamic', 'highly dynamic'],
        timePeriod: ['cooling peak', 'heating peak'],
        temperature_uncertainty: ['low', 'medium', 'high'],
        solar_uncertainty: ['low', 'high'],
      },
      tags: ['comfort', 'optimized', 'weekend'],
      versions: ['0.1.0', '0.2.0'],
    });

    expect(queryMock).toHaveBeenNthCalledWith(1, 'BEGIN');
    expect(queryMock.mock.calls[1][0]).toContain('INSERT INTO documents');
    expect(queryMock.mock.calls[2][0]).toContain('SELECT doc_id');
    expect(queryMock.mock.calls[3][0]).toContain('UPDATE documents');
    expect(queryMock).toHaveBeenLastCalledWith('COMMIT');
    expect(releaseMock).toHaveBeenCalled();
  });

  it('inserts a new facet when no existing document is found', async () => {
    const insertedRow = {
      doc_id: 'doc-3',
      collection: 'resultFacets',
      numeric_id: 21,
      data: {
        buildingTypeUid: 'buildingType-2',
        buildingTypeName: 'Medium building',
        scenario: {
          timePeriod: ['cooling peak'],
          temperature_uncertainty: ['low'],
        },
        tags: ['comfort'],
        versions: ['0.3.0'],
      },
      created_at: '2024-01-05T00:00:00.000Z',
      updated_at: '2024-01-05T00:00:00.000Z',
    };

    const queryMock = jest
      .fn()
      .mockResolvedValueOnce({})
      .mockResolvedValueOnce({rowCount: 1, rows: [insertedRow]})
      .mockResolvedValueOnce({});

    const releaseMock = jest.fn();

    getDocumentStore.mockResolvedValue({
      getPool: () => ({
        connect: () => ({query: queryMock, release: releaseMock}),
      }),
    });

    const result = await upsertResultFacet(
      'buildingType-2',
      'Medium building',
      {
        timePeriod: ['cooling peak'],
      },
      ['comfort'],
      '0.3.0'
    );

    expect(result).toEqual({
      buildingTypeUid: 'buildingType-2',
      buildingTypeName: 'Medium building',
      scenario: {
        timePeriod: ['cooling peak'],
      },
      tags: ['comfort'],
      versions: ['0.3.0'],
    });

    expect(queryMock).toHaveBeenNthCalledWith(1, 'BEGIN');
    expect(queryMock.mock.calls[1][0]).toContain('INSERT INTO documents');
    expect(queryMock).toHaveBeenLastCalledWith('COMMIT');
    expect(releaseMock).toHaveBeenCalled();
  });
});
