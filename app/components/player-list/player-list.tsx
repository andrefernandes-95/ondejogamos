import { getTranslations, getLocale } from "next-intl/server";
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

export default async function PlayerList({ data }: { data: Player[] }) {
  const t = await getTranslations();
  const locale = await getLocale();
  return (
    <Container maxWidth="lg" sx={{ p: 2 }}>
      <PageTitle title={t("Players.title")} />
      <TableContainer component={Paper} variant="outlined">
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>{t("Common.name")}</TableCell>
              <TableCell>{t("Players.registrationDate")}</TableCell>
              <TableCell>{t("Players.matchesCreated")}</TableCell>
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
