import { useTranslations } from "next-intl";
import { AppRoutes } from "@/app/utils/routes";
import { ChevronLeft } from "@mui/icons-material";
import { Box, Button, Stack, Typography } from "@mui/material";

export default function PageTitle({ title }: { title: string }) {
  const t = useTranslations();
  return (
    <>
      <Button
        component="a"
        href={AppRoutes.HOME}
        size="small"
        sx={{
          flexGrow: 0,
          alignSelf: "flex-start",
          gap: 1,
        }}
      >
        <ChevronLeft /> <Typography variant="body1">{t("Common.back")}</Typography>
      </Button>

      <Box sx={{ py: 1 }} />

      <Typography variant="h5" sx={{ fontWeight: 900 }} color="primary">
        {title}
      </Typography>

      <Box sx={{ py: 1 }} />
    </>
  );
}
