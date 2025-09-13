import { CONSTANTS } from "@/utils/constants";
import { getUsers } from "@/api/users";
import { useQuery } from "@tanstack/react-query";

export const useUsers = () =>
  useQuery({
    queryFn: getUsers,
    queryKey: ["users"],
    retry: CONSTANTS.config.api.retry,
    staleTime: CONSTANTS.config.api.staleTime,
  });
