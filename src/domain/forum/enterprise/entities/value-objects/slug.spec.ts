import { Slug } from '@/domain/forum/enterprise/entities/value-objects/slug'

test('should be able to create a new slug from text', async () => {
  const slug = Slug.createFromText('Example question title')

  expect(slug.value).toBe('example-question-title')
})
