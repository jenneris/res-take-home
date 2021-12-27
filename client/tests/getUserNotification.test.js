import { getUserNotifications, clearNotifications } from '../src/services/uisvc';
import { notificationRecords } from './test-utils';
  
describe('src/services/uisvc', () => {



  global.fetch = jest.fn(() =>
  Promise.resolve({
    json: () => Promise.resolve(notificationRecords),
  })
  )

  beforeEach(() => {
    fetch.mockClear();
  });

  it('Retrievevs user notifications', async () => {
    const json = await getUserNotifications('2');

    expect(global.fetch).toHaveBeenCalledWith(
      'http://localhost:3001/api/notification/user/2'
    );
    expect(Array.isArray(json)).toEqual(true);
    expect(json.length).toEqual(2)
  });

  it('Retrievevs deletes notifications', async () => {
    const json = await clearNotifications(notificationRecords);
    expect(global.fetch.mock.calls).toEqual([
      ['http://localhost:3001/api/notification/1',{ method: 'DELETE' }], // First call
      ['http://localhost:3001/api/notification/2',{ method: 'DELETE' }]  // Second call
    ]);
      expect(fetch).toHaveBeenCalled();
      expect(fetch).toHaveBeenCalledTimes(2); 
  });
})