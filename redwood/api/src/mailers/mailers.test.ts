import sendNotaryApproved from './sendNotaryApproved'
import sendNotaryFeedback from './sendNotaryFeedback'

describe('mailers', () => {
  test.skip('sendNotaryApproved', async () => {
    await sendNotaryApproved(
      'hi@test.com',
      '0xed2ece94cdca3dd3605dba4dc4240788f4dd6e29'
    )
  })
  test.skip('sendNotaryFeedback', async () => {
    await sendNotaryFeedback(
      'hi@test.com',
      'video does not show your entire face'
    )
  })
})