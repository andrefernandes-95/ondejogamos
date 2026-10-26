import PageTitle from "@/app/components/page-title/page-title";
import useLocalization from "@/app/hooks/locale";
import { Player } from "@/app/services/user";
import {
  Container,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from "@mui/material";

export default function PlayerList({ data }: { data: Player[] }) {
  const isEn = useLocalization() === "EN";
  return (
    <Container maxWidth="lg" sx={{ p: 2 }}>
      <PageTitle title={isEn ? "Player List" : "Jogadores Registados"} />
      <TableContainer component={Paper} variant="outlined">
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>{isEn ? "Name" : "Nome"}</TableCell>
              <TableCell>{isEn ? "Joined At" : "Data de Registo"}</TableCell>
              <TableCell>
                {isEn ? "Games Scheduled" : "Jogos Criados"}
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {data.map((player) => {
              const weekDay = new Intl.DateTimeFormat(isEn ? "en" : "pt-PT", {
                day: "2-digit",
                month: "long",
                year: "numeric",
                timeZone: "Europe/Lisbon",
              }).format(new Date(player.createdAt));

              return (
                <TableRow key={player.id}>
                  <TableCell>
                    <Typography>{player.name}</Typography>
                  </TableCell>
                  <TableCell>
                    <Typography>{weekDay}</Typography>
                  </TableCell>
                  <TableCell>
                    <Typography>{player.games_created}</Typography>
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </TableContainer>
    </Container>
  );
}
