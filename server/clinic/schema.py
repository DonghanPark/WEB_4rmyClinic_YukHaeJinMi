import graphene
import gql.query

# import gql.mutation

class Query(gql.query.Query, graphene.ObjectType):
  pass

# class Mutation(graphene.ObjectType):
#   pass

schema=graphene.Schema(query=Query)