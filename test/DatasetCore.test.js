const { strictEqual } = require('assert')
const namespace = require('@rdfjs/namespace')
const { describe, it } = require('mocha')

function runTests (rdf) {
  const ex = namespace('http://example.org/', rdf)

  describe('DatasetCore', () => {
    describe('factory', () => {
      it('should be a function', () => {
        strictEqual(typeof rdf.dataset, 'function')
      })

      it('should add the given Quads', () => {
        const quad1 = rdf.quad(ex.subject, ex.predicate, ex.object1)
        const quad2 = rdf.quad(ex.subject, ex.predicate, ex.object2)

        const dataset = rdf.dataset([quad1, quad2])

        strictEqual(dataset.has(quad1), true)
        strictEqual(dataset.has(quad2), true)
      })
    })

    describe('size', () => {
      it('should be a number property', () => {
        const dataset = rdf.dataset()

        strictEqual(typeof dataset.size, 'number')
      })

      it('should be 0 if there are no Quads in the Dataset', () => {
        const dataset = rdf.dataset()

        strictEqual(dataset.size, 0)
      })

      it('should be equal to the number of Quads in the Dataset', () => {
        const quad1 = rdf.quad(ex.subject, ex.predicate, ex.object1)
        const quad2 = rdf.quad(ex.subject, ex.predicate, ex.object2)
        const dataset = rdf.dataset([quad1, quad2])

        strictEqual(dataset.size, 2)
      })

      it('should be updated after Quads are added', () => {
        const dataset = rdf.dataset([rdf.quad(ex.subject, ex.predicate, ex.object1)])

        strictEqual(dataset.size, 1)

        dataset.add(rdf.quad(ex.subject, ex.predicate, ex.object2))

        strictEqual(dataset.size, 2)
      })

      it('should be updated after Quads are deleted', () => {
        const quad1 = rdf.quad(ex.subject, ex.predicate, ex.object1)
        const quad2 = rdf.quad(ex.subject, ex.predicate, ex.object2)
        const dataset = rdf.dataset([quad1, quad2])

        strictEqual(dataset.size, 2)

        dataset.delete(quad1)

        strictEqual(dataset.size, 1)
      })
    })

    describe('add', () => {
      it('should be a function', () => {
        const dataset = rdf.dataset()

        strictEqual(typeof dataset.add, 'function')
      })

      it('should return itself', () => {
        const quad = rdf.quad(ex.subject, ex.predicate, ex.object)
        const dataset = rdf.dataset()

        const result = dataset.add(quad)

        strictEqual(result, dataset)
      })

      it('should add the given Quad', () => {
        const quad = rdf.quad(ex.subject, ex.predicate, ex.object)
        const dataset = rdf.dataset()

        dataset.add(quad)

        strictEqual(dataset.has(quad), true)
      })

      it('should not add duplicate Quads', () => {
        const quadA = rdf.quad(ex.subject, ex.predicate, ex.object)
        const quadB = rdf.quad(ex.subject, ex.predicate, ex.object)
        const dataset = rdf.dataset()

        dataset.add(quadA)
        dataset.add(quadB)

        strictEqual(dataset.size, 1)
      })

      it('should support Quads with Blank Nodes', () => {
        const quad = rdf.quad(ex.subject, ex.predicate, rdf.blankNode())
        const dataset = rdf.dataset()

        dataset.add(quad)

        strictEqual(dataset.size, 1)
        strictEqual(dataset.has(quad), true)
      })

      it('should support Quads with Literals', () => {
        const quad = rdf.quad(ex.subject, ex.predicate, rdf.literal('test'))
        const dataset = rdf.dataset()

        dataset.add(quad)

        strictEqual(dataset.size, 1)
        strictEqual(dataset.has(quad), true)
      })

      it('should support Quads with language Literals', () => {
        const quadA = rdf.quad(ex.subject, ex.predicate, rdf.literal('test', 'en'))
        const quadB = rdf.quad(ex.subject, ex.predicate, rdf.literal('test', 'de'))
        const dataset = rdf.dataset()

        dataset.add(quadA)

        strictEqual(dataset.size, 1)
        strictEqual(dataset.has(quadA), true)
        strictEqual(dataset.has(quadB), false)

        dataset.add(quadB)

        strictEqual(dataset.size, 2)
        strictEqual(dataset.has(quadA), true)
        strictEqual(dataset.has(quadB), true)
      })

      it('should support Quads with datatype Literals', () => {
        const quadA = rdf.quad(ex.subject, ex.predicate, rdf.literal('123', ex.datatypeA))
        const quadB = rdf.quad(ex.subject, ex.predicate, rdf.literal('123', ex.datatypeB))
        const dataset = rdf.dataset()

        dataset.add(quadA)

        strictEqual(dataset.size, 1)
        strictEqual(dataset.has(quadA), true)
        strictEqual(!dataset.has(quadB), true)

        dataset.add(quadB)

        strictEqual(dataset.size, 2)
        strictEqual(dataset.has(quadA), true)
        strictEqual(dataset.has(quadB), true)
      })

      it('should support Quads having a Quad as subject', () => {
        const quadA = rdf.quad(ex.subject, ex.predicate, ex.object)
        const quadB = rdf.quad(quadA, ex.predicate, ex.object)
        const dataset = rdf.dataset()

        dataset.add(quadB)

        strictEqual(dataset.size, 1)
        strictEqual(dataset.has(quadB), true)
      })

      it('should support Quads having a Quad as object', () => {
        const quadA = rdf.quad(ex.subject, ex.predicate, ex.object)
        const quadB = rdf.quad(ex.subject, ex.predicate, quadA)
        const dataset = rdf.dataset()

        dataset.add(quadB)

        strictEqual(dataset.size, 1)
        strictEqual(dataset.has(quadB), true)
      })
    })

    describe('delete', () => {
      it('should be a function', () => {
        const dataset = rdf.dataset()

        strictEqual(typeof dataset.delete, 'function')
      })

      it('should return itself', () => {
        const quad = rdf.quad(ex.subject, ex.predicate, ex.object)
        const dataset = rdf.dataset([quad])

        const result = dataset.delete(quad)

        strictEqual(result, dataset)
      })

      it('should remove the given Quad', () => {
        const quad = rdf.quad(ex.subject, ex.predicate, ex.object)
        const dataset = rdf.dataset([quad])

        dataset.delete(quad)

        strictEqual(dataset.has(quad), false)
      })

      it('should remove only the given Quad', () => {
        const quad1 = rdf.quad(ex.subject, ex.predicate, ex.object1)
        const quad2 = rdf.quad(ex.subject, ex.predicate, ex.object2)
        const dataset = rdf.dataset([quad1, quad2])

        dataset.delete(quad1)

        strictEqual(dataset.has(quad1), false)
        strictEqual(dataset.has(quad2), true)
      })

      it('should remove the Quad with the same SPOG as the given Quad', () => {
        const quad = rdf.quad(ex.subject, ex.predicate, ex.object)
        const quadCloned = rdf.quad(quad.subject, quad.predicate, quad.object, quad.graph)
        const dataset = rdf.dataset([quad])

        dataset.delete(quadCloned)

        strictEqual(dataset.has(quad), false)
      })

      it('should ignore an unknown Quad', () => {
        const quad1 = rdf.quad(ex.subject, ex.predicate, ex.object1)
        const quad2 = rdf.quad(ex.subject, ex.predicate, ex.object2)
        const dataset = rdf.dataset([quad1])

        dataset.delete(quad2)

        strictEqual(dataset.has(quad1), true)
        strictEqual(dataset.has(quad2), false)
        strictEqual(dataset.size, 1)
      })
    })

    describe('has', () => {
      it('should be a function', () => {
        const dataset = rdf.dataset()

        strictEqual(typeof dataset.has, 'function')
      })

      it('should return false if the given Quad is not in the Dataset', () => {
        const quad1 = rdf.quad(ex.subject, ex.predicate, ex.object1)
        const quad2 = rdf.quad(ex.subject, ex.predicate, ex.object2)
        const dataset = rdf.dataset([quad1])

        strictEqual(dataset.has(quad2), false)
      })

      it('should return true if the given Quad is in the Dataset', () => {
        const quad1 = rdf.quad(ex.subject, ex.predicate, ex.object1)
        const quad2 = rdf.quad(ex.subject, ex.predicate, ex.object2)
        const dataset = rdf.dataset([quad1, quad2])

        strictEqual(dataset.has(quad2), true)
      })
    })

    describe('match', () => {
      it('should be a function', () => {
        const dataset = rdf.dataset()

        strictEqual(typeof dataset.match, 'function')
      })

      it('should use the given subject to select Quads', () => {
        const quad1 = rdf.quad(ex.subject1, ex.predicate, ex.object)
        const quad2 = rdf.quad(ex.subject2, ex.predicate, ex.object)
        const dataset = rdf.dataset([quad1, quad2])

        const matches = dataset.match(ex.subject2)

        strictEqual(matches.size, 1)
        strictEqual(matches.has(quad2), true)
      })

      it('should use the given predicate to select Quads', () => {
        const quad1 = rdf.quad(ex.subject, ex.predicate1, ex.object)
        const quad2 = rdf.quad(ex.subject, ex.predicate2, ex.object)
        const dataset = rdf.dataset([quad1, quad2])

        const matches = dataset.match(null, ex.predicate2)

        strictEqual(matches.size, 1)
        strictEqual(matches.has(quad2), true)
      })

      it('should use the given object to select Quads', () => {
        const quad1 = rdf.quad(ex.subject, ex.predicate, ex.object1)
        const quad2 = rdf.quad(ex.subject, ex.predicate, ex.object2)
        const dataset = rdf.dataset([quad1, quad2])

        const matches = dataset.match(null, null, ex.object2)

        strictEqual(matches.size, 1)
        strictEqual(matches.has(quad2), true)
      })

      it('should use the given graph to select Quads', () => {
        const quad1 = rdf.quad(ex.subject, ex.predicate, ex.object, ex.graph1)
        const quad2 = rdf.quad(ex.subject, ex.predicate, ex.object, ex.graph2)
        const dataset = rdf.dataset([quad1, quad2])

        const matches = dataset.match(null, null, null, ex.graph2)

        strictEqual(matches.size, 1)
        strictEqual(matches.has(quad2), true)
      })

      it('should return an empty Dataset if there are no matches', () => {
        const quad1 = rdf.quad(ex.subject1, ex.predicate, ex.object)
        const quad2 = rdf.quad(ex.subject2, ex.predicate, ex.object)
        const dataset = rdf.dataset([quad1, quad2])

        const matches = dataset.match(null, null, ex.object3)

        strictEqual(matches.size, 0)
      })
    })

    describe('Symbol.iterator', () => {
      it('should be a function', () => {
        const dataset = rdf.dataset()

        strictEqual(typeof dataset[Symbol.iterator], 'function')
      })

      it('should return an iterator', () => {
        const quad1 = rdf.quad(ex.subject1, ex.predicate, ex.object)
        const quad2 = rdf.quad(ex.subject2, ex.predicate, ex.object)
        const dataset = rdf.dataset([quad1, quad2])

        const iterator = dataset[Symbol.iterator]()

        strictEqual(typeof iterator.next, 'function')
        strictEqual(typeof iterator.next().value, 'object')
      })

      it('should iterate over all Quads', () => {
        const quad1 = rdf.quad(ex.subject1, ex.predicate, ex.object)
        const quad2 = rdf.quad(ex.subject2, ex.predicate, ex.object)
        const dataset = rdf.dataset([quad1, quad2])

        const iterator = dataset[Symbol.iterator]()

        const output = rdf.dataset()

        for (let item = iterator.next(); item.value; item = iterator.next()) {
          output.add(item.value)
        }

        strictEqual(output.size, 2)
        strictEqual(output.has(quad1), true)
        strictEqual(output.has(quad2), true)
      })
    })
  })
}

module.exports = runTests
