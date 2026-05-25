import * as React from 'react';
import { useNavigate } from 'react-router';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import {
    Box,
    IconButton,
    Stack,
    Table,
    TableBody,
    TableCell,
    TableHead,
    TablePagination,
    TableRow,
    Typography,
} from '@mui/material';
import { DeleteOutlined as DeleteIcon } from '@mui/icons-material';
import type { FormDto } from '@digital-net-org/digital-api-sdk';
import { useDnApi } from '../../../api';
import { DN_QUERY_KEY_GET, DnEntityTabHelper, useDnEntityFormContext } from '../../../entity';
import { DnLoadingView, formatDate, formatEllipsis } from '../../../ui';
import { useDnToast } from '../../../app';

export function FormTabSubmissions() {
    const navigate = useNavigate();
    const { values } = useDnEntityFormContext<FormDto>();
    const formId = values.id;
    const api = useDnApi();
    const queryClient = useQueryClient();
    const { showToast } = useDnToast();

    const [page, setPage] = React.useState(0);
    const [rowsPerPage, setRowsPerPage] = React.useState(10);

    const queryKey = [DN_QUERY_KEY_GET, 'form', formId, 'submissions', page, rowsPerPage] as const;
    const { data, isLoading } = useQuery({
        queryKey,
        queryFn: async () => {
            const result = await api.catalog.form.getSubmissions({
                formId,
                index: page + 1,
                size: rowsPerPage,
            });
            if (result.hasError) {
                throw new Error(result.errors?.[0]?.message ?? 'Failed to fetch submissions');
            }
            return result.value;
        },
        enabled: !!formId,
    });

    const handleDelete = React.useCallback(
        async (submissionId: string) => {
            const result = await api.catalog.form.deleteSubmission(submissionId);
            if (result.hasError) {
                showToast('Erreur lors de la suppression', 'error');
                return;
            }
            showToast('Soumission supprimée', 'info');
            await queryClient.invalidateQueries({ queryKey: [DN_QUERY_KEY_GET, 'form', formId, 'submissions'] });
        },
        [api.catalog.form, formId, queryClient, showToast]
    );

    if (!formId) return null;
    if (isLoading) return <DnLoadingView />;
    return (
        <Stack sx={{ gap: 2, height: '100%' }}>
            <DnEntityTabHelper description="Liste des soumissions reçues. Cliquez sur une ligne pour ouvrir le détail en lecture seule." />
            <Box sx={{ width: '100%', overflow: 'auto' }}>
                <Table size="small">
                    <TableHead>
                        <TableRow>
                            <TableCell>Reçue le</TableCell>
                            <TableCell>Adresse IP</TableCell>
                            <TableCell>User-Agent</TableCell>
                            <TableCell align="right">Actions</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {!data?.value?.length ? (
                            <TableRow>
                                <TableCell colSpan={4} align="center">
                                    <Typography variant="body2" color="text.secondary" sx={{ py: 4 }}>
                                        Aucune soumission pour ce formulaire.
                                    </Typography>
                                </TableCell>
                            </TableRow>
                        ) : (
                            data.value.map(submission => (
                                <TableRow
                                    key={submission.id}
                                    hover
                                    sx={{ cursor: 'pointer' }}
                                    onClick={() =>
                                        navigate(`/content-manager/forms/${formId}/submissions/${submission.id}`)
                                    }
                                >
                                    <TableCell>{formatDate(submission.createdAt)}</TableCell>
                                    <TableCell>{submission.submitterIp ?? '—'}</TableCell>
                                    <TableCell>{formatEllipsis(submission.userAgent, 60)}</TableCell>
                                    <TableCell align="right" onClick={event => event.stopPropagation()}>
                                        <IconButton
                                            size="small"
                                            aria-label="Supprimer la soumission"
                                            onClick={() => handleDelete(submission.id)}
                                        >
                                            <DeleteIcon fontSize="small" />
                                        </IconButton>
                                    </TableCell>
                                </TableRow>
                            ))
                        )}
                    </TableBody>
                </Table>
                <TablePagination
                    component="div"
                    count={data?.total ?? 0}
                    page={page}
                    onPageChange={(_, newPage) => setPage(newPage)}
                    rowsPerPage={rowsPerPage}
                    onRowsPerPageChange={event => {
                        setRowsPerPage(parseInt(event.target.value, 10));
                        setPage(0);
                    }}
                    rowsPerPageOptions={[10, 25, 50]}
                />
            </Box>
        </Stack>
    );
}
