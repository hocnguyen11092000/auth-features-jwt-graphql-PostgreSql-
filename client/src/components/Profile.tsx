import { useHelloQuery } from "../generated/graphql";

const Profile = () => {
  const { data, error, loading } = useHelloQuery({ fetchPolicy: "no-cache" });

  if (loading) return <h3 style={{ textAlign: "center" }}>Loading...</h3>;
  if (error) return <h3 style={{ textAlign: "center" }}>Error...</h3>;

  return <h1 style={{ textAlign: "center" }}>{`${data?.hello}`}</h1>;
};

export default Profile;
