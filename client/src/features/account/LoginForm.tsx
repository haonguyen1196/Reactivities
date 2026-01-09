import { useForm } from "react-hook-form";
import { useAccount } from "../../lib/hooks/useAccount";
import { zodResolver } from "@hookform/resolvers/zod";
import { loginSchema, type LoginSchema } from "../../lib/schemas/loginSchema";
import { Box, Button, Paper, Typography } from "@mui/material";
import { LockOpen } from "@mui/icons-material";
import TextInput from "../../app/shared/components/TextInput";
import { Link, useLocation, useNavigate } from "react-router";

export default function LoginForm() {
    const location = useLocation();
    const navigate = useNavigate();
    const { loginUser } = useAccount();
    const {
        control,
        handleSubmit,
        formState: { isValid, isSubmitting },
    } = useForm<LoginSchema>({
        mode: "onTouched",
        resolver: zodResolver(loginSchema),
    });

    const onSubmit = async (data: LoginSchema) => {
        await loginUser.mutateAsync(data, {
            onSuccess: () => {
                navigate(location.state?.from || "/activities"); // chuyển về trang trước
            },
        });
    };

    return (
        <Paper
            component="form"
            onSubmit={handleSubmit(onSubmit)}
            sx={{
                display: "flex",
                flexDirection: "column",
                p: 3,
                gap: 3,
                maxWidth: "md",
                mx: "auto",
                borderRadius: 3,
            }}
        >
            <Box
                display="flex"
                alignItems="center"
                justifyContent="center"
                gap={3}
                color="secondary.main"
            >
                <LockOpen fontSize="large" />
                <Typography variant="h4">Sign in</Typography>
            </Box>
            <TextInput label="Email" control={control} name="email" />
            <TextInput
                label="Password"
                type="password"
                control={control}
                name="password"
            />
            <Button
                type="submit"
                disabled={!isValid || isSubmitting}
                variant="contained"
                size="large"
            >
                Login
            </Button>
            {/* <Button
                onClick={loginWithGithub}
                startIcon={<GitHub />}
                sx={{backgroundColor: 'black'}}
                type="button"
                variant="contained"
                size="large"
            >
                Login with Github
            </Button>
            {notVerified ? (
                <Box display='flex' flexDirection='column' justifyContent='center'>
                    <Typography textAlign='center' color='error'>
                        Your email has not been verified.  You can click the button to re-send the verification email
                    </Typography>
                    <Button
                        disabled={resendConfirmationEmail.isPending}
                        onClick={handleResendEmail}
                    >
                        Re-send email link
                    </Button>
                </Box>
            ) : (
                <Box display='flex' alignItems='center' justifyContent='center' gap={3}>
                    <Typography>
                        Forgot password? Click <Link to='/forgot-password'>here</Link>
                    </Typography>

                    <Typography sx={{ textAlign: 'center' }}>
                        Don't have an account?
                        <Typography sx={{ ml: 2 }} component={Link} to='/register' color="primary">
                            Sign up
                        </Typography>
                    </Typography>
                </Box>
            )} */}
            <Typography sx={{ textAlign: "center" }}>
                Don't have an account?
                <Typography
                    sx={{ ml: 2 }}
                    component={Link}
                    to="/register"
                    color="primary"
                >
                    Sign up
                </Typography>
            </Typography>
        </Paper>
    );
}
