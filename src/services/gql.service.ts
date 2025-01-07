import {GraphQLClient, RequestDocument} from 'graphql-request';

class GraphQLService {
  private client: GraphQLClient;

  constructor(url: string) {
    if (!url) {
      throw new Error('GraphQL endpoint URL must be provided');
    }

    this.client = new GraphQLClient(url);
  }

  async run<T>(query: RequestDocument, variables: Record<string, any> = {}): Promise<T> {
    try {
      // const token = await AsyncStorage.getItem('token');
      // Log the token for debugging, if needed (ensure not to log sensitive information in production)
      // const token = process.env.API_KEY ?? '';
      // console.log(`Using token: ${token ? 'Provided' : 'Not Provided'}`);

      // Use the existing headers or set new ones as needed
      this.client.setHeaders({
        // Authorization: `Bearer ${token}`,
      });
      console.log('Executing GraphQL request:', {query, variables});
      // Execute the request and return the response
      return await this.client.request<T>(query, variables);
    } catch (error: any) {
      // Enhanced error handling
      console.error('GraphQL Request Error:', error);

      throw error;
    }
  }
}

export default GraphQLService;
