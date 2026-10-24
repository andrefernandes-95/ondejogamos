import { AppRoutes } from "@/app/utils/routes";
import { ChevronLeft } from "@mui/icons-material";
import { Box, Button, Typography } from "@mui/material";
import { useTranslations } from "next-intl";

export default function PageTitle({ title }: { title: string }) {
  const tApp = useTranslations();
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
        <ChevronLeft /> <Typography variant="body1">{tApp("App.PageTitle.back")}</Typography>
      </Button>

      <Box sx={{ py: 1 }} />

      <Typography variant="h5" sx={{ fontWeight: 900 }} color="primary">
        {title}
      </Typography>

      <Box sx={{ py: 1 }} />
    </>
  );
}
