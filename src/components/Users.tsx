import { toast } from "react-hot-toast";
import { useEffect } from "react";
import { useUsers } from "@/hooks/useUsers";

export const Users = () => {
  const { data: users, isLoading, error } = useUsers();

  useEffect(() => {
    if (error) {
      toast.error(error.message);
    }
  }, [error]);

  if (isLoading) {
    return <p>Loading...</p>;
  }

  return (
    <ul>
      {users?.map(user => (
        <li key={user.id}>{user.name}</li>
      ))}
    </ul>
  );
};
