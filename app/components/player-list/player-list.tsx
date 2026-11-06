import PageTitle from "@/app/components/page-title/page-title";
import { Player } from "@/app/services/user";
import { useTranslations } from "next-intl";
import { useLocale } from "next-intl";
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
  const tApp = useTranslations();
  const locale = useLocale();
  return (
    <Container maxWidth="lg" sx={{ p: 2 }}>
      <PageTitle title={tApp("App.PlayerList.player_list")} />
      <TableContainer component={Paper} variant="outlined">
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>{tApp("App.PlayerList.name")}</TableCell>
              <TableCell>{tApp("App.PlayerList.joined_at")}</TableCell>
              <TableCell>
                {tApp("App.PlayerList.games_scheduled")}
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {data.map((player) => {
              const weekDay = new Intl.DateTimeFormat(locale, {
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
