import PageTitle from "@/app/components/page-title/page-title";
import { Player } from "@/app/services/user";
import { AppRoutes } from "@/app/utils/routes";
import { Space } from "@mantine/core";
import { ChevronLeft } from "@mui/icons-material";
import {
  Box,
  Button,
  Card,
  Container,
  Divider,
  List,
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
  return (
    <Container maxWidth="lg" sx={{ p: 2 }}>
      <PageTitle title="Jogadores Registados" />
      <TableContainer component={Paper} variant="outlined">
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Nome</TableCell>
              <TableCell>Data de Registo</TableCell>
              <TableCell>Jogos Criados</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {data.map((player) => {
              const weekDay = new Intl.DateTimeFormat("pt-PT", {
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
