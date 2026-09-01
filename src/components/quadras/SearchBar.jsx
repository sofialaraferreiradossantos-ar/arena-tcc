import { FaSearch } from "react-icons/fa";
import styles from "../../styles/home.module.css";

export default function SearchBar({ search, setSearch }) {
  return <label className={styles.searchBar}>
    <FaSearch className={styles.searchIcon} />
    <input type="search" aria-label="Pesquisar quadras" placeholder="Pesquisar quadras..." value={search} onChange={(event) => setSearch(event.target.value)} />
  </label>;
}
