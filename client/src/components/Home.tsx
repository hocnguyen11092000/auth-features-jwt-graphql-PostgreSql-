import { useUserQuery } from "../generated/graphql";

const Home = () => {
  const { data, loading } = useUserQuery({ fetchPolicy: "no-cache" });
  if (loading) return <h1>Loading...</h1>;
  return (
    <div className="container">
      <h2>List user</h2>
      <ul>
        {data?.users.map((user) => {
          return (
            <li className="item" key={user.id}>
              {user.username}
            </li>
          );
        })}
      </ul>
    </div>
  );
};

export default Home;
