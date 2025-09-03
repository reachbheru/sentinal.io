from Backend.api.v1.schemas.query.request import UserQuery
from Backend.api.v1.schemas.query.response import QueryEnhancementOutput
from Backend.config.v1.constants.general import enhancement_suffix


class QueryService:
    def __init__(self, user_query: UserQuery, llm):
        self.user_query = user_query

    async def enhance_query(self):
        enhanced_query= {"enhanced_query": self.user_query.query + " " + enhancement_suffix}
        enhanced_query = QueryEnhancementOutput.model_validate(enhanced_query)
        return enhanced_query