import type { GraphqlMutation, GraphqlQuery } from "../interface";
import { useQuery, useMutation } from "@tanstack/react-query";
import { GraphQLClient } from "graphql-request";
import Cookies from "js-cookie";

const getGraphqlClient = () => {
  const token =
    Cookies.get("accessToken") || localStorage.getItem("accessToken") || "";

  return new GraphQLClient(
    import.meta.env.VITE_GRAPHQL_URL! || "http://localhost:8000/graphql",
    {
      headers: {
        Authorization: token ? `Bearer ${token}` : "",
      },
      fetch: (url, options) => {
        // Handle file uploads
        if (options?.body instanceof FormData) {
          // Remove Content-Type header to let the browser set it with boundary
          if (options.headers) {
            delete (options.headers as any)["Content-Type"];
          }
        }
        return fetch(url, options);
      },
    },
  );
};

const useQlQuery = (
  queryKey: string,
  query: string,
  variables?: object,
  dynamicKey?: string,
) => {
  const fetchData = async (): Promise<GraphqlQuery> => {
    const client = getGraphqlClient();
    const data = await client.request(query, variables);
    return data as GraphqlQuery;
  };

  const constructedKey = [queryKey, dynamicKey];

  return useQuery({
    queryKey: constructedKey,
    queryFn: fetchData,
  });
};

export const useQlMutation = (mutation: string) => {
  return useMutation({
    mutationFn: async (variables: any): Promise<GraphqlMutation> => {
      const client = getGraphqlClient();

      // Check if variables contain a file
      const hasFile = variables?.file instanceof File;

      if (hasFile) {
        // Convert file to base64 string
        const file = variables.file as File;
        const base64 = await new Promise<string>((resolve, reject) => {
          const reader = new FileReader();
          reader.onload = () => {
            const result = reader.result as string;
            // Extract base64 part after the comma
            resolve(result.split(",")[1]);
          };
          reader.onerror = reject;
          reader.readAsDataURL(file);
        });

        // Send as base64 string with metadata
        const mutationVariables = {
          ...variables,
          file: {
            filename: file.name,
            mimetype: file.type,
            encoding: "base64",
            data: base64,
          },
        };

        const response = await client.request(mutation, mutationVariables);
        return response as GraphqlMutation;
      } else {
        // Regular JSON request for non-file mutations
        const response = await client.request(mutation, variables);
        return response as GraphqlMutation;
      }
    },
  });
};

export default useQlQuery;
