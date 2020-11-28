import assert from 'assert'
import { createCrewSuites } from "../controllers/cards"

describe('Crew Deck', function() {
  it('createCrewSuites generates a deck with 4 suits and 9 values for each suit', function() {
    const cards = createCrewSuites()
    assert.strictEqual(cards.length, 36)
  })
})